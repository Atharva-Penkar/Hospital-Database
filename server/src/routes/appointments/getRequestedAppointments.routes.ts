import { Router } from "express";
import { getRequestedAppointments } from "../../controllers/appointments/getRequestedAppointments.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getRequestedAppointmentsRouter = Router();

// Route to fetch all appointments with Requested status
getRequestedAppointmentsRouter.get("/requested", asyncHandler(getRequestedAppointments));

export default getRequestedAppointmentsRouter;
