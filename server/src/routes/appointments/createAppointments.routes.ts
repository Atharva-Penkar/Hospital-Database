import { Router } from "express";
import { createAppointment } from "../../controllers/appointments/createAppointments.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const createAppointmentsRouter = Router();

// Route to schedule a new appointment
createAppointmentsRouter.post("/", asyncHandler(createAppointment));

export default createAppointmentsRouter;
