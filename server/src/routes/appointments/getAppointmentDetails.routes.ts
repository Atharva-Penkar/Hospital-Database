import { Router } from "express";
import { getAppointmentDetails } from "../../controllers/appointments/getAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const appointmentDetailsRouter = Router();

// GET /api/appointments/:appointmentId
appointmentDetailsRouter.get("/:appointmentId", asyncHandler(getAppointmentDetails));

export default appointmentDetailsRouter;
