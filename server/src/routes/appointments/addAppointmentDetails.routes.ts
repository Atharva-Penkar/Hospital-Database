// routes/appointments/addAppointmentDetailsRouter.ts
import { Router } from "express";
import { addAppointmentDetails } from "../../controllers/appointments/addAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const router = Router();

// POST /api/appointments/:appointmentId/details
router.post("/:appointmentId/details", asyncHandler(addAppointmentDetails));

export default router;
