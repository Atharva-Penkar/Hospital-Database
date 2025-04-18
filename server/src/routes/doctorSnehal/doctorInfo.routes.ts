import { Router } from "express";
import { getDoctorById } from "../../controllers/doctorSnehal/doctorInfo.contollers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const doctorInfoRouter = Router();

doctorInfoRouter.get("/:id", asyncHandler(getDoctorById));

export default doctorInfoRouter;
