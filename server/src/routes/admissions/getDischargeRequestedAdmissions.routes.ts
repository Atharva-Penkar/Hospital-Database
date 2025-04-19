import { Router } from "express";
import * as admitController from "../../controllers/admissions/getDischargeRequestedAdmissions.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getDischargeRequestedAdmissionsRouter = Router();

// Get all admits with status Discharge_Requested
getDischargeRequestedAdmissionsRouter.get(
  "/discharge-requested",
  asyncHandler(admitController.getAllDischargeRequestedAdmissions)
);

export default getDischargeRequestedAdmissionsRouter;
