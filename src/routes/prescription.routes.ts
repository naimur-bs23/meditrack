import { Router } from 'express';
import {
    createPrescription,
    getAllPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} from '../controllers/prescription.controller';

const prescriptionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Prescription:
 *       type: object
 *       required:
 *         - doctorId
 *         - patientId
 *         - medicineList
 *         - dosage
 *         - instructions
 *         - date
 *       properties:
 *         id:
 *           type: integer
 *         doctorId:
 *           type: integer
 *         patientId:
 *           type: integer
 *         medicineList:
 *           type: array
 *           items:
 *             type: string
 *         dosage:
 *           type: string
 *         instructions:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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
 *             $ref: '#/components/schemas/Prescription'
 *     responses:
 *       201:
 *         description: Prescription created
 *       500:
 *         description: Server error
 */
prescriptionRouter.post('/', createPrescription);

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
 *             $ref: '#/components/schemas/Prescription'
 *     responses:
 *       200:
 *         description: Prescription updated
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Server error
 */
prescriptionRouter.put('/:id', updatePrescription);

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
prescriptionRouter.delete('/:id', deletePrescription);

export default prescriptionRouter;
