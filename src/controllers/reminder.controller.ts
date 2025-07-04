import { Op } from 'sequelize';
import { MedicineReminder } from '../models/medicine-reminder.model';
import { PrescriptionMedicine } from '../models/prescription-medicine.model';
import { Medicine } from '../models/medicine.model';
import { Prescription } from '../models/prescription.model';
import { User } from '../models/user.model';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { Response } from 'express';

export const fetchPendingReminders = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const now = new Date();
        const beforeParam = req.query.before ? new Date(String(req.query.before)) : now;
        const limit = Number(req.query.limit) || 100;

        const reminders = await MedicineReminder.findAll({
            where: {
                sent: false,
                reminderTime: { [Op.lte]: beforeParam },
            },
            include: [
                {
                    model: PrescriptionMedicine,
                    include: [
                        {
                            model: Medicine,
                        },
                        {
                            model: Prescription,
                            include: [
                                { model: User, as: 'patient' },
                                { model: User, as: 'doctor' },
                            ],
                        },
                    ],
                },
            ],
            limit,
            order: [['reminderTime', 'ASC']],
        });

        res.json({ reminders });
    } catch (err) {
        res.status(500).json({
            error: err instanceof Error ? err.message : 'Unknown error occurred',
        });
    }
};

export const bulkUpdateReminderStatus = (field: 'acknowledged' | 'sent') =>
    async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const { ids } = req.body;

            if (!Array.isArray(ids) || ids.length === 0) {
                res.status(400).json({ message: '"ids" must be a non-empty array of numbers' });
                return;
            }

            if (!ids.every(id => typeof id === 'number')) {
                res.status(400).json({ message: 'All IDs must be numbers' });
                return;
            }

            // Fetch all matching reminders
            const reminders = await MedicineReminder.findAll({
                where: { id: ids }
            });

            const foundIds = reminders.map(r => r.id);
            const notFoundIds = ids.filter(id => !foundIds.includes(id));

            // Bulk update existing ones
            await MedicineReminder.update(
                { [field]: true },
                { where: { id: foundIds } }
            );

            res.status(notFoundIds.length ? 207 : 200).json({
                message: `Updated ${field} status`,
                updatedIds: foundIds,
                notFoundIds
            });
        } catch (err) {
            console.error(`Error bulk updating ${field}:`, err);
            res.status(500).json({
                error: err instanceof Error ? err.message : 'Internal server error'
            });
        }
    };
