import {Router} from "express";
import authRouter from "./auth.routes";
import prescriptionRouter from "./prescription.routes";
import medicineRouter from "./medicine.routes";
import reminderRouter from "./reminder.routes";

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/prescriptions', prescriptionRouter);
appRouter.use('/medicines', medicineRouter);
appRouter.use('/reminders', reminderRouter);

export default appRouter;