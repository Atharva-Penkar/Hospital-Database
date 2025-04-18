// routes/appointments/updateAppointments.routes.js
import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { scheduleAppointment } from "../../controllers/appointments/updateAppointments.controllers";

const scheduleAppointmentRouter = Router();
scheduleAppointmentRouter.put("/", asyncHandler(scheduleAppointment));
export default scheduleAppointmentRouter;
