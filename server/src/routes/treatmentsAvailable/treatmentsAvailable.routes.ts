import { Router } from "express";
import * as treatmentsAvailableController from "../../controllers/treatmentsAvailable/treatmentsAvailable.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const treatmentsAvailableRouter = Router();

// Get all treatments
treatmentsAvailableRouter.get("/", asyncHandler(treatmentsAvailableController.getAllTreatmentsAvailable));

// Get a treatment by ID
treatmentsAvailableRouter.get("/:id", asyncHandler(treatmentsAvailableController.getTreatmentAvailableById));

// Create a new treatment
treatmentsAvailableRouter.post("/", asyncHandler(treatmentsAvailableController.createTreatmentAvailable));

// Update a treatment by ID
treatmentsAvailableRouter.put("/:id", asyncHandler(treatmentsAvailableController.updateTreatmentAvailable));

// Delete a treatment by ID
treatmentsAvailableRouter.delete("/:id", asyncHandler(treatmentsAvailableController.deleteTreatmentAvailable));

export default treatmentsAvailableRouter;
