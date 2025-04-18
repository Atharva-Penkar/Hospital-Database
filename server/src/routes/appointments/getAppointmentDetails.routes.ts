import { Router } from "express";
import { getAppointmentDetails } from "../../controllers/appointments/getAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getAppointmentDetailsRouter = Router();

// GET /api/appointments/:appointmentId
getAppointmentDetailsRouter.get("/:appointmentId", asyncHandler(getAppointmentDetails));

export default getAppointmentDetailsRouter;
