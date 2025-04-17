import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { getDoctorsBySpecialization } from "../../controllers/doctors/getDoctors.controllers";

const getDoctorsBySpecializationRouter = Router();

getDoctorsBySpecializationRouter.get("/", asyncHandler(getDoctorsBySpecialization));

export default getDoctorsBySpecializationRouter;
