import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { getAppointmentsByPidOrdered } from "../../controllers/patient/patientAppointments.controllers";

// This router is mounted in your main server file with a path like:
// app.use("/api/appointments/patient", patientAppointmentsRouter)
// so that the URL becomes /api/appointments/patient/:pid
const patientAppointmentsRouter = Router();

patientAppointmentsRouter.get("/:pid", asyncHandler(getAppointmentsByPidOrdered));

export default patientAppointmentsRouter;
