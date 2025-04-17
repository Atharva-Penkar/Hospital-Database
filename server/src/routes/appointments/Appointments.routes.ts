import { Router } from "express";
import { getRequestedAppointments, getScheduledAppointments } from "../../controllers/appointments/getAppointments.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getAppointmentsRouter = Router();

// Route to fetch all appointments with Requested, Scheduled status
getAppointmentsRouter.get("/requested", asyncHandler(getRequestedAppointments));
getAppointmentsRouter.get("/scheduled", asyncHandler(getScheduledAppointments));
export default getAppointmentsRouter;
