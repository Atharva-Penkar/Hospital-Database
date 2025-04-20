import { Router } from "express";
import { setTestResults } from "../../controllers/tests/setTestsResults.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const setTestResultsRouter = Router();

// Set result for a specific test (mark as completed)
setTestResultsRouter.put("/:testId", asyncHandler(setTestResults));

export default setTestResultsRouter;
