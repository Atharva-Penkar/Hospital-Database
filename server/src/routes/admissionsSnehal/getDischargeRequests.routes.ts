import { Router } from "express";
import { getDischargeRequests } from "../../controllers/admissionsSnehal/getDischargeRequests.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getDischargeRequestsRouter = Router();

// GET /api/front-desk-operator/admissions/discharge-requested
getDischargeRequestsRouter.get("/", asyncHandler(getDischargeRequests));

export default getDischargeRequestsRouter;
