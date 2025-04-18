import { Router } from "express";
import { getPendingAppointmentsForDoctor } from "../../controllers/doctorSnehal/doctorPending.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const doctorPendingAppointmentsRouter = Router();

doctorPendingAppointmentsRouter.get("/:id", asyncHandler(getPendingAppointmentsForDoctor));

export default doctorPendingAppointmentsRouter;
