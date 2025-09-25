import { Router } from 'express';
import {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} from '../controllers/prescription.controller';
import {authenticate} from "../middleware/authenticate";
import {authorize} from "../middleware/authorize";
import {UserRole} from "../models/user.model";

const prescriptionRouter = Router();

// Use Authentication middleware
prescriptionRouter.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription endpoints
 *
 * components:
 *   schemas:
 *     PrescriptionRequest:
 *       type: object
 *       required:
 *         - patientId
 *         - prescriptionMedicines
 *         - date
 *       properties:
 *         patientId:
 *           type: integer
 *           example: 1
 *         prescriptionMedicines:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - medicineId
 *               - dosage
 *               - instructions
 *               - durationDays
 *               - scheduleTimes
 *             properties:
 *               medicineId:
 *                 type: integer
 *                 example: 1
 *               dosage:
 *                 type: string
 *                 example: "500 mg"
 *               instructions:
 *                 type: string
 *                 example: "Take after meal"
 *               durationDays:
 *                 type: integer
 *                 example: 7
 *               scheduleTimes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *                 example: ["08:00", "20:00"]
 *         date:
 *           type: string
 *           format: date
 *           example: "2025-06-27"
 *
 *     Prescription:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         doctorId:
 *           type: integer
 *         patientId:
 *           type: integer
 *         date:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         prescriptionMedicines:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrescriptionMedicine'
 *
 *     PrescriptionMedicine:
 *       type: object
 *       properties:
 *         medicineId:
 *           type: integer
 *         dosage:
 *           type: string
 *         instructions:
 *           type: string
 *         durationDays:
 *           type: integer
 *         scheduleTimes:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *           example: ["08:00", "20:00"]
 */

/**
 * @swagger
 * /prescriptions:
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionRequest'
 *     responses:
 *       201:
 *         description: Prescription created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       500:
 *         description: Server error
 */
prescriptionRouter.post('/', authorize([UserRole.DOCTOR]), createPrescription);

/**
 * @swagger
 * /prescriptions:
 *   get:
 *     summary: Get all prescriptions
 *     tags: [Prescriptions]
 *     responses:
 *       200:
 *         description: A list of prescriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Prescription'
 *       500:
 *         description: Server error
 */
prescriptionRouter.get('/', getAllPrescriptions);

/**
 * @swagger
 * /prescriptions/{id}:
 *   get:
 *     summary: Get a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prescription'
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */
prescriptionRouter.get('/:id', getPrescriptionById);

/**
 * @swagger
 * /prescriptions/{id}:
 *   put:
 *     summary: Update a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PrescriptionRequest'
 *     responses:
 *       200:
 *         description: Prescription updated
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */
prescriptionRouter.put('/:id', authorize([UserRole.DOCTOR]), updatePrescription);

/**
 * @swagger
 * /prescriptions/{id}:
 *   delete:
 *     summary: Delete a prescription by ID
 *     tags: [Prescriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Prescription ID
 *     responses:
 *       200:
 *         description: Prescription deleted
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */
prescriptionRouter.delete('/:id', authorize([UserRole.DOCTOR, UserRole.ADMIN]), deletePrescription);

export default prescriptionRouter;
