// routes/appointments/setAppointmentDetailsRouter.ts
import { Router } from "express";
import { setAppointmentDetails } from "../../controllers/appointments/setAppointmentDetails.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const router = Router();

// PUT /api/appointments/:appointmentId/details
router.put("/:appointmentId", asyncHandler(setAppointmentDetails));

export default router;
