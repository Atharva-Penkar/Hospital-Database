import { Router } from "express";
import * as patientsController from "../../controllers/DBmanager/patient.controller";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const patientsRouter = Router();

// Get all patients
patientsRouter.get("/", asyncHandler(patientsController.getAllPatients));

// Get a patient by ID
patientsRouter.get("/:id", asyncHandler(patientsController.getPatientById));

// Create a new patient
patientsRouter.post("/", asyncHandler(patientsController.createPatient));

// Update a patient by ID
patientsRouter.put("/:id", asyncHandler(patientsController.updatePatient));

// Delete a patient by ID
patientsRouter.delete("/:id", asyncHandler(patientsController.deletePatient));

export default patientsRouter;
