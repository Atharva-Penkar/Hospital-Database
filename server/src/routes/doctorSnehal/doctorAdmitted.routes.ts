// routes/doctor/doctorAdmittedPatientsRouter.ts
import { Router } from "express";
import { getAdmittedPatientsForDoctor, requestDischargeForAdmittedPatient } from "../../controllers/doctorSnehal/doctorAdmitted.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const doctorAdmittedPatientsRouter = Router();

doctorAdmittedPatientsRouter.get("/:id", asyncHandler(getAdmittedPatientsForDoctor));
doctorAdmittedPatientsRouter.put("/:id/discharge/:admitId/", asyncHandler(requestDischargeForAdmittedPatient));

export default doctorAdmittedPatientsRouter;
