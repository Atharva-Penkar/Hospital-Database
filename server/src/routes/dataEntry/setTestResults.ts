import { Router } from "express";
import { setTestResults } from "../../controllers/dataEntry/setTestResults.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const setTestResultsRouter = Router();

// Set result for a specific test (mark as completed)
setTestResultsRouter.put("/:testID", asyncHandler(setTestResults));

export default setTestResultsRouter;
