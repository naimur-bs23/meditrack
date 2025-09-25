import {Router} from "express";
import {authenticate} from "../middleware/authenticate";
import {
    createMedicine,
    deleteMedicine,
    getAllMedicines,
    getMedicineById,
    updateMedicine
} from "../controllers/medicine.controller";
import {authorize} from "../middleware/authorize";
import {UserRole} from "../models/user.model";

const medicineRouter = Router();

medicineRouter.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Medicines
 *   description: Medicine Endpoints
 *
 * components:
 *   schemas:
 *     MedicineRequest:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: "Napa"
 *         type:
 *           type: string
 *           example: "Paracetamol"
 *         description:
 *           type: string
 *           example: "Napa is generally indicated for fever, common cold and influenza."
 *
 *     Medicine:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /medicines:
 *   post:
 *     summary: Create a new medicine
 *     tags: [Medicines]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineRequest'
 *     responses:
 *       201:
 *         description: Medicine Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       500:
 *         description: Server error
 */
medicineRouter.post('/', authorize([UserRole.PHARMACIST]), createMedicine);

/**
 * @swagger
 * /medicines:
 *   get:
 *     summary: Get all medicines
 *     tags: [Medicines]
 *     responses:
 *       200:
 *         description: A list of medicines
 *         content:
 *           application/json:
 *             schema:
 *               type: schema
 *               items:
 *                 $ref: '#/components/schemas/Medicine'
 *       500:
 *         description: Server Error
 */
medicineRouter.get('/', getAllMedicines);

/**
 * @swagger
 * /medicines/{id}:
 *   get:
 *     summary: Get a medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     responses:
 *       200:
 *         description: Medicine found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Medicine'
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineRouter.get('/:id', getMedicineById);

/**
 * @swagger
 * /medicines/{id}:
 *   put:
 *     summary: Update a medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MedicineRequest'
 *     responses:
 *       200:
 *         description: Medicine updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineRouter.put('/:id', authorize([UserRole.PHARMACIST]), updateMedicine);

/**
 * @swagger
 * /medicines/{id}:
 *   delete:
 *     summary: Delete a medicine by ID
 *     tags: [Medicines]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Medicine ID
 *     responses:
 *       200:
 *         description: Medicine deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Medicine not found
 *       500:
 *         description: Server error
 */
medicineRouter.delete('/:id', authorize([UserRole.PHARMACIST]), deleteMedicine);

export default medicineRouter;