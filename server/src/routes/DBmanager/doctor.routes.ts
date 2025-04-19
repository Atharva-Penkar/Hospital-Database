import { Router } from "express";
import * as doctorsController from "../../controllers/DBmanager/doctor.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const doctorsRouter = Router();

// Get all doctors
doctorsRouter.get("/", asyncHandler(doctorsController.getAllDoctors));

// Get a doctor by ID
doctorsRouter.get("/:id", asyncHandler(doctorsController.getDoctorById));

// Create a new doctor
doctorsRouter.post("/", asyncHandler(doctorsController.createDoctor));

// Update a doctor by ID
doctorsRouter.put("/:id", asyncHandler(doctorsController.updateDoctor));

// Delete a doctor by ID
doctorsRouter.delete("/:id", asyncHandler(doctorsController.deleteDoctor));

export default doctorsRouter;
