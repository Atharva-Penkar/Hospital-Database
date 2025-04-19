import { Router } from "express";
import * as admitController from "../../controllers/admissions/getAdmitRequestedAdmissions.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getAdmitRequestedAdmissionsRouter = Router();

// Get all admits with status Admit_Requested
getAdmitRequestedAdmissionsRouter.get("/admit-requested", asyncHandler(admitController.getAllAdmitRequestedAdmissions));

export default getAdmitRequestedAdmissionsRouter;
