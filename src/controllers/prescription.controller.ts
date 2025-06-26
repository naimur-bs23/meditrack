import { Request, Response } from 'express';
import { Prescription } from '../models/prescription.model';
import { User } from '../models/user.model';

export const createPrescription = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            doctorId,
            patientId,
            medicineList,
            dosage,
            instructions,
            date
        } = req.body;

        const prescription = await Prescription.create({
            doctorId,
            patientId,
            medicineList,
            dosage,
            instructions,
            date,
        });

        res.status(201).json({ message: 'Prescription created', prescription });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllPrescriptions = async (_req: Request, res: Response): Promise<void> => {
    try {
        const prescriptions = await Prescription.findAll({
            include: [
                { model: User, as: 'doctor', attributes: ['id', 'name', 'email', 'role'] },
                { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'role'] },
            ],
        });

        res.json(prescriptions);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getPrescriptionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findByPk(id, {
            include: [
                { model: User, as: 'doctor', attributes: ['id', 'name', 'email', 'role'] },
                { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'role'] },
            ],
        });

        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        res.json(prescription);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const updatePrescription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const {
            doctorId,
            patientId,
            medicineList,
            dosage,
            instructions,
            date,
        } = req.body;

        const prescription = await Prescription.findByPk(id);
        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        await prescription.update({
            doctorId,
            patientId,
            medicineList,
            dosage,
            instructions,
            date,
        });

        res.json({ message: 'Prescription updated', prescription });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const deletePrescription = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findByPk(id);

        if (!prescription) {
            res.status(404).json({ message: 'Prescription not found' });
            return;
        }

        await prescription.destroy();
        res.json({ message: 'Prescription deleted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
