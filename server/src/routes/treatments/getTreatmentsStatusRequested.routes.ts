import { Router } from "express";
import { getRequestedTreatmentsController } from "../../controllers/treatments/getTreatmentsStatusRequested.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const treatmentsRequestedRouter = Router();

treatmentsRequestedRouter.get("/", asyncHandler(getRequestedTreatmentsController));

export default treatmentsRequestedRouter;
