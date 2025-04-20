import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { updateTreatmentTimeAndStatus } from "../../controllers/treatments/scheduleTreatments.controllers";

const updateTreatmentRouter = Router();

// PUT /api/treatments/update
// Expects a JSON body with treatment_id and newTime fields
updateTreatmentRouter.put("/", asyncHandler(updateTreatmentTimeAndStatus));

export default updateTreatmentRouter;
