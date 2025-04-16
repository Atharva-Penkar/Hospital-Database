import { Router } from "express";
import { createAppointment } from "../../controllers/appointments/appointments.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const appointmentsRouter = Router();

// Route to schedule a new appointment
appointmentsRouter.post("/", asyncHandler(createAppointment));

export default appointmentsRouter;
