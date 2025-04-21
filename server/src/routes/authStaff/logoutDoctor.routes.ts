import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { logoutDoctor } from "../../controllers/authStaff/logoutDoctor.controllers";

const logoutDoctorRouter = Router();

// POST /api/auth-staff/logout/doctor
logoutDoctorRouter.post("/", asyncHandler(logoutDoctor));

export default logoutDoctorRouter;
