import { Router } from "express";
import { getCompletedAppointmentsForDoctor } from "../../controllers/doctorSnehal/doctorComplete.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const doctorCompletedAppointmentsRouter = Router();

doctorCompletedAppointmentsRouter.get("/:id", asyncHandler(getCompletedAppointmentsForDoctor));

export default doctorCompletedAppointmentsRouter;
