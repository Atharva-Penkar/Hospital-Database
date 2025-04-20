// routes/appointments/setAppointmentDetailsRouter.ts
import { Router } from "express";
import { setAppointmentDetails } from "../../controllers/appointments/setAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const setAppointmentDetailsRouter = Router();

// PUT /api/appointments/:appointmentId/details
setAppointmentDetailsRouter.put("/:appointmentId", asyncHandler(setAppointmentDetails));

export default setAppointmentDetailsRouter;
