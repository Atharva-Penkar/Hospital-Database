import { Router } from "express";
import { getScheduledTreatmentsController } from "../../controllers/treatments/getTreatmentsStatusScheduled.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const treatmentsScheduledRouter = Router();

treatmentsScheduledRouter.get("/", asyncHandler(getScheduledTreatmentsController));

export default treatmentsScheduledRouter;
