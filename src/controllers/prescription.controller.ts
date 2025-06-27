import { Response } from 'express';
import { Prescription } from '../models/prescription.model';
import { User, UserRole } from '../models/user.model';
import { PrescriptionRequest } from "../requests/prescription.request";
import { AuthenticatedRequest } from '../middleware/authenticate';
import { Medicine } from "../models/medicine.model";
import { PrescriptionMedicine } from "../models/prescription-medicine.model";
import { sequelize } from "../models";

interface PrescriptionWhereClause {
    doctorId?: number;
    patientId?: number;
    id?: number;
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
            where: {
                id: prescriptionId,
                doctorId,
            },
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

        // If medicine list is provided, do a smart sync
        if (Array.isArray(prescriptionMedicines)) {
            const existingItems = prescription.prescriptionMedicines || [];

            const incomingMap = new Map(
                prescriptionMedicines.map((item: any) => [String(item.medicineId), item])
            );

            // Remove medicines that are not in the request
            const toRemove = existingItems.filter(
                (existing) => !incomingMap.has(String(existing.medicineId))
            );

            for (const item of toRemove) {
                await item.destroy({ transaction: t });
            }

            // Update or create incoming medicines
            for (const item of prescriptionMedicines) {
                const existing = existingItems.find(
                    (e) => e.medicineId === item.medicineId
                );

                if (existing) {
                    await existing.update(
                        {
                            dosage: item.dosage,
                            instructions: item.instructions,
                        },
                        { transaction: t }
                    );
                } else {
                    await PrescriptionMedicine.create(
                        {
                            prescriptionId: prescription.id,
                            medicineId: item.medicineId,
                            dosage: item.dosage,
                            instructions: item.instructions,
                        },
                        { transaction: t }
                    );
                }
            }
        }

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