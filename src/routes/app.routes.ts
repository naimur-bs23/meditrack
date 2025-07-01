import {Router} from "express";
import authRouter from "./auth.routes";
import prescriptionRouter from "./prescription.routes";
import medicineRouter from "./medicine.routes";

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/prescriptions', prescriptionRouter);
appRouter.use('/medicines', medicineRouter);

export default appRouter;