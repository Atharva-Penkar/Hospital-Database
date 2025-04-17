import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { getAllSpecializations } from "../../controllers/doctors/getSpecializations.controllers";

const getSpecializationsRouter = Router();

getSpecializationsRouter.get("/", asyncHandler(getAllSpecializations));

export default getSpecializationsRouter;
