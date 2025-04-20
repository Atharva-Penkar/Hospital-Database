import { Router } from "express";
import { dischargePatient } from "../../controllers/admissionsSnehal/dischargePatientFromRoom.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const dischargePatientRouter = Router();

// PUT /api/front-desk-operator/admissions/discharge/:admitId
dischargePatientRouter.put("/:admitId", asyncHandler(dischargePatient));

export default dischargePatientRouter;
