import {Router} from "express";
import {authenticate} from "../middleware/authenticate";
import {bulkUpdateReminderStatus, fetchPendingReminders} from "../controllers/reminder.controller";

const reminderRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Reminder
 *   description: Reminder Endpoints
 */

reminderRouter.use(authenticate);

/**
 * @swagger
 * /reminders:
 *   get:
 *     summary: Get all pending medicine reminders
 *     tags: [Reminder]
 *     responses:
 *       200:
 *         description: A list of pending reminders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reminders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       reminderTime:
 *                         type: string
 *                         format: date-time
 *                       sent:
 *                         type: boolean
 *                       acknowledged:
 *                         type: boolean
 *                       prescriptionMedicineId:
 *                         type: integer
 *                       prescriptionMedicine:
 *                         type: object
 *                         properties:
 *                           dosage:
 *                             type: string
 *                           instructions:
 *                             type: string
 *                           medicine:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                           prescription:
 *                             type: object
 *                             properties:
 *                               patient:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   name:
 *                                     type: string
 *                               doctor:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: integer
 *                                   name:
 *                                     type: string
 *       500:
 *         description: Server error
 */

reminderRouter.get('/', fetchPendingReminders);

/**
 * @swagger
 * /reminders/acknowledged:
 *   patch:
 *     summary: Bulk mark reminders as acknowledged
 *     tags: [Reminder]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: All reminders acknowledged successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 notFoundIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *       207:
 *         description: Partial success – some reminders were not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 notFoundIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

reminderRouter.patch('/acknowledged', authenticate, bulkUpdateReminderStatus("acknowledged"));

/**
 * @swagger
 * /reminders/sent:
 *   patch:
 *     summary: Bulk mark reminders as sent
 *     tags: [Reminder]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [4, 5]
 *     responses:
 *       200:
 *         description: All reminders marked as sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 notFoundIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *       207:
 *         description: Partial success – some reminders were not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 notFoundIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

reminderRouter.patch('/sent', authenticate, bulkUpdateReminderStatus("sent"));

export default reminderRouter;