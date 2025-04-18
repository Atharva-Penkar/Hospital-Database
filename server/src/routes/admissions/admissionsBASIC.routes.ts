import { Router } from "express";
import * as admissionsController from "../../controllers/admissions/admissionsBASIC.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const admissionsRouter = Router();

// Get all admissions
admissionsRouter.get("/", asyncHandler(admissionsController.getAllAdmissions));

// Get an admission by ID
admissionsRouter.get("/:id", asyncHandler(admissionsController.getAdmissionById));

// Create a new admission
admissionsRouter.post("/", asyncHandler(admissionsController.createAdmission));

// Update an admission by ID
admissionsRouter.put("/:id", asyncHandler(admissionsController.updateAdmission));

export default admissionsRouter;
