import {Router} from "express";
import authRouter from "./auth.routes";
import prescriptionRouter from "./prescription.routes";

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('prescriptions', prescriptionRouter);

export default appRouter;