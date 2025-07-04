import { Response } from 'express';
import { Prescription } from '../models/prescription.model';
import { User, UserRole } from '../models/user.model';
import { PrescriptionRequest } from "../requests/prescription.request";
import { AuthenticatedRequest } from '../middleware/authenticate';
import { Medicine } from "../models/medicine.model";
import { PrescriptionMedicine } from "../models/prescription-medicine.model";
import { sequelize } from "../models";
import {MedicineReminder} from "../models/medicine-reminder.model";

interface PrescriptionWhereClause {
    doctorId?: number;
    patientId?: number;
    id?: number;
}

function isValidScheduleTime(time: string): boolean {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
}

const createMedicineReminders = async (
    prescription: Prescription,
    transaction: any
): Promise<void> => {
    const prescriptionWithMedicines = await Prescription.findByPk(prescription.id, {
        include: [
            {
                model: PrescriptionMedicine,
                as: 'prescriptionMedicines',
                include: [Medicine],
            },
        ],
        transaction,
    });

    if (!prescriptionWithMedicines) {
        throw new Error('Failed to fetch prescription medicines for reminders');
    }

    const remindersToCreate: Partial<MedicineReminder>[] = [];

    const startDate = prescriptionWithMedicines.date;

    for (const pm of prescriptionWithMedicines.prescriptionMedicines) {
        const durationDays = (pm as any).durationDays ?? 1;
        const scheduleTimes: string[] = (pm as any).scheduleTimes ?? [];

        for (const time of scheduleTimes) {
            if (!isValidScheduleTime(time)) {
                throw new Error(
                    `Invalid schedule time format '${time}' in medicine ID ${pm.id}. Expected "HH:mm" 24-hour format.`
                );
            }
        }

        if (scheduleTimes.length === 0) {
            scheduleTimes.push("08:00");
        }

        for (let day = 0; day < durationDays; day++) {
            for (const time of scheduleTimes) {
                const [hourStr, minuteStr] = time.split(":");
                const hour = parseInt(hourStr, 10);
                const minute = parseInt(minuteStr, 10);

                const reminderDate = new Date(startDate);
                reminderDate.setDate(reminderDate.getDate() + day);
                reminderDate.setHours(hour, minute, 0, 0);

                remindersToCreate.push({
                    prescriptionMedicineId: pm.id,
                    reminderTime: reminderDate,
                    sent: false,
                    acknowledged: false,
                });
            }
        }
    }

    if (remindersToCreate.length > 0) {
        await MedicineReminder.bulkCreate(remindersToCreate, { transaction });
    }
}

export const createPrescription = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const prescriptionData: PrescriptionRequest = req.body as PrescriptionRequest;

    const doctorId = req.user?.id;
    if (!doctorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const t = await sequelize.transaction();
    try {
        const prescription = await Prescription.create(
            {
                doctorId,
                ...prescriptionData
            },
            {
                include: [{ model: PrescriptionMedicine, as: 'prescriptionMedicines' }],
                transaction: t,
            }
        );

        await createMedicineReminders(prescription, t);
        await t.commit();

        const fullPrescription = await Prescription.findByPk(prescription.id, {
            include: [
                {
                    model: PrescriptionMedicine,
                    as: 'prescriptionMedicines',
                    include: [Medicine],
                },
            ],
        });

        res.status(201).json({ message: 'Prescription created', prescription: fullPrescription });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error occurred' });
    }
};

export const getAllPrescriptions = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const whereClause: PrescriptionWhereClause = {};
        
        if (req.user?.role === UserRole.DOCTOR) {
            whereClause.doctorId = req.user.id;
        } else if (req.user?.role === UserRole.PATIENT) {
            whereClause.patientId = req.user.id;
        }

        const prescriptions = await Prescription.findAll({
            where: {...whereClause},
            include: [
                { 
                    model: User, 
                    as: 'doctor', 
                    attributes: ['id', 'name', 'email', 'role'] 
                },
                { 
                    model: User, 
                    as: 'patient', 
                    attributes: ['id', 'name', 'email', 'role'] 
                },
                {
                    model: PrescriptionMedicine,
                    as: 'prescriptionMedicines',
                    include: [Medicine],
                    attributes: ['medicineId', 'dosage', 'instructions']
                }
            ],
        });

        res.json(prescriptions);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
};

export const getPrescriptionById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const whereClause: PrescriptionWhereClause = { id: Number(req.params.id) };
        
        if (req.user?.role === UserRole.DOCTOR) {
            whereClause.doctorId = req.user.id;
        } else if (req.user?.role === UserRole.PATIENT) {
            whereClause.patientId = req.user.id;
        }

        const prescription = await Prescription.findOne({
            where: {...whereClause},
            include: [
                { 
                    model: User, 
                    as: 'doctor', 
                    attributes: ['id', 'name', 'email', 'role'] 
                },
                { 
                    model: User, 
                    as: 'patient', 
                    attributes: ['id', 'name', 'email', 'role'] 
                },
                {
                    model: PrescriptionMedicine,
                    as: 'prescriptionMedicines',
                    include: [Medicine],
                    attributes: ['medicineId', 'dosage', 'instructions']
                }
            ],
        });

        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        res.json(prescription);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
};

export const updatePrescription = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const prescriptionId = Number(req.params.id);
    const doctorId = req.user?.id;

    if (!doctorId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const t = await sequelize.transaction();
    try {
        const prescription = await Prescription.findOne({
            where: { id: prescriptionId, doctorId },
            include: [{ model: PrescriptionMedicine, as: 'prescriptionMedicines' }],
            transaction: t,
        });

        if (!prescription) {
            await t.rollback();
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        const { date, patientId, prescriptionMedicines } = req.body;

        // Update basic fields if provided
        if (date || patientId) {
            await prescription.update(
                {
                    ...(date && { date }),
                    ...(patientId && { patientId }),
                },
                { transaction: t }
            );
        }

        if (Array.isArray(prescriptionMedicines)) {
            const existingItems = prescription.prescriptionMedicines || [];
            const incomingMap = new Map(
                prescriptionMedicines.map((item: any) => [String(item.medicineId), item])
            );

            // Remove deleted medicines + their reminders
            const toRemove = existingItems.filter(
                (existing) => !incomingMap.has(String(existing.medicineId))
            );

            for (const item of toRemove) {
                await MedicineReminder.destroy({
                    where: { prescriptionMedicineId: item.id },
                    transaction: t,
                });
                await item.destroy({ transaction: t });
            }

            // Update or create incoming medicines
            for (const item of prescriptionMedicines) {
                if (!item.scheduleTimes || !Array.isArray(item.scheduleTimes)) {
                    throw new Error(`Missing or invalid scheduleTimes for medicineId ${item.medicineId}`);
                }

                item.scheduleTimes.forEach((t: string) => {
                    if (!isValidScheduleTime(t)) {
                        throw new Error(`Invalid scheduleTime format: ${t} for medicineId ${item.medicineId}`);
                    }
                });

                const existing = existingItems.find((e) => e.medicineId === item.medicineId);

                if (existing) {
                    await existing.update(
                        {
                            dosage: item.dosage,
                            instructions: item.instructions,
                            durationDays: item.durationDays,
                            scheduleTimes: item.scheduleTimes,
                        },
                        { transaction: t }
                    );

                    await MedicineReminder.destroy({
                        where: { prescriptionMedicineId: existing.id },
                        transaction: t,
                    });
                } else {
                    const newMed = await PrescriptionMedicine.create(
                        {
                            prescriptionId: prescription.id,
                            medicineId: item.medicineId,
                            dosage: item.dosage,
                            instructions: item.instructions,
                            durationDays: item.durationDays,
                            scheduleTimes: item.scheduleTimes,
                        },
                        { transaction: t }
                    );
                    existingItems.push(newMed); // So reminders can be generated
                }
            }
        }

        // Regenerate all reminders
        await createMedicineReminders(prescription, t);

        await t.commit();

        const fullPrescription = await Prescription.findByPk(prescription.id, {
            include: [
                {
                    model: PrescriptionMedicine,
                    as: 'prescriptionMedicines',
                    include: [Medicine],
                },
            ],
        });

        res.json({ message: 'Prescription updated', prescription: fullPrescription });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
};

export const deletePrescription = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const prescription = await Prescription.findOne({
            where: { 
                id: Number(req.params.id),
                doctorId: req.user?.id
            }
        });

        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        await prescription.destroy();
        res.json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
};