import { Router } from "express";
import { getAdmitRequests } from "../../controllers/admissionsSnehal/getAdmitRequests.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getAdmitRequestsRouter = Router();

// GET /api/front-desk-operator/admissions/admit-requested
getAdmitRequestsRouter.get("/", asyncHandler(getAdmitRequests));

export default getAdmitRequestsRouter;
