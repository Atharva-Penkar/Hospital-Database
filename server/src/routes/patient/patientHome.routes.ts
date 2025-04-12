import { Router } from "express";
import { getPatientById, createPatient } from "../../controllers/patient/patientHome.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const patientRouter = Router();

// Route to get patient by ID
patientRouter.get("/patient/:id", asyncHandler(getPatientById));

// Route to create a new patient
patientRouter.post("/patient", asyncHandler(createPatient));

export default patientRouter;
