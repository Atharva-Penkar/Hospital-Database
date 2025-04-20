import { Router } from "express";
import { dischargePatient } from "../../controllers/admissionsSnehal/dischargePatientFromRoom.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const dischargePatientFromRoomRouter = Router();

// PUT /api/front-desk-operator/admissions/discharge/:admitId
dischargePatientFromRoomRouter.put("/:admitId", asyncHandler(dischargePatient));

export default dischargePatientFromRoomRouter;
