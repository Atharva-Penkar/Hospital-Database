// routes/appointments/addAppointmentDetailsRouter.ts
import { Router } from "express";
import { addAppointmentDetails } from "../../controllers/appointments/addAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const addAppointmentDetailsRouter = Router();

// POST /api/appointments/:appointmentId/details
addAppointmentDetailsRouter.post("/:appointmentId", asyncHandler(addAppointmentDetails));

export default addAppointmentDetailsRouter;
