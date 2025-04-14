import { Router } from "express";
import { addPatientInfo } from "../../controllers/patient/patientInfo.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const patientInfoRouter = Router();

// Route to add patient information
patientInfoRouter.post("/", asyncHandler(addPatientInfo));

export default patientInfoRouter;
