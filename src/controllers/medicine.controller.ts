import {Response} from "express";
import {AuthenticatedRequest} from "../middleware/authenticate";
import {Medicine} from "../models/medicine.model";
import {MedicineRequest} from "../requests/medicine.request";

export const createMedicine = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const medicineData: MedicineRequest = req.body;
    const pharmacistId = req.user?.id;
    if (!pharmacistId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    await Medicine.create({...medicineData});
    res.status(201).json({ message: 'Medicine created' });
}

export const getAllMedicines = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const prescriptions = await Medicine.findAll();
        res.json(prescriptions);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
}

export const getMedicineById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const medicineId = Number(req.params.id);
        const medicine = await Medicine.findByPk(medicineId);
        if (!medicine) {
            res.status(404).json({message: 'Medicine not found'});
            return;
        }
        res.json(medicine);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
}

export const updateMedicine = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const medicineId = Number(req.params.id);
        const pharmacistId = req.user?.id;
        const medicineData: MedicineRequest = req.body;
        if (!pharmacistId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const medicine = await Medicine.findByPk(medicineId);
        if (!medicine) {
            res.status(404).json({message: 'Medicine not found'});
            return;
        }
        await medicine.update({...medicineData});
        res.json({message: 'Medicine updated'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
}

export const deleteMedicine = async(
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const medicine = await Medicine.findByPk(id);
        if (!medicine) {
            res.status(404).json({message: 'Medicine not found'});
            return;
        }
        await medicine.destroy();
        res.json({message: 'Medicine deleted successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
}
