import { Router } from "express";
import { getPatientById } from "../../controllers/patient/patientHome.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const patientRouter = Router();

// Route to get patient by ID
patientRouter.get("/:id", asyncHandler(getPatientById));

// Route to create a new patient
// patientRouter.post("/", asyncHandler(createPatient));

export default patientRouter;
