import { Response } from 'express';
import { Prescription } from '../models/prescription.model';
import { User, UserRole } from '../models/user.model';
import { PrescriptionRequest } from "../requests/prescription.request";
import { AuthenticatedRequest } from '../middleware/authenticate';

interface PrescriptionWhereClause {
    doctorId?: number;
    patientId?: number;
    id?: number;
}

export const createPrescription = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const prescriptionData: PrescriptionRequest = {
            ...req.body,
            doctorId: req.user?.id
        };

        const prescription = await Prescription.create({...prescriptionData});
        res.status(201).json({ message: 'Prescription created', prescription });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
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

        const prescriptionData: PrescriptionRequest = { ...req.body, doctorId: req.user?.id };

        const updatedPrescription = await prescription.update(prescriptionData);
        res.json({ message: 'Prescription updated', prescription: updatedPrescription });
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
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