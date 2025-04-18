import { Router } from "express";
import * as admitController from "../../controllers/admissions/updateAR2AAdmissions.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const admitPatientRouter = Router();

// Update admission: Admit_Requested -> Admitted, set admit_time, update room number
admitPatientRouter.put("/admit/:id", asyncHandler(admitController.admitPatient));

export default admitPatientRouter;
