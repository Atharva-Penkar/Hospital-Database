import { Router } from "express";
import { admitPatientToRoom } from "../../controllers/admissionsSnehal/admitPatientToRoom.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const admitPatientToRoomRouter = Router();

// PUT /api/front-desk-operator/admissions/:AdmitID/Room/:RoomNo
admitPatientToRoomRouter.put("/:AdmitID/Room/:RoomNo", asyncHandler(admitPatientToRoom));

export default admitPatientToRoomRouter;
