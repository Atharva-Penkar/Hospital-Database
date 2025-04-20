import { Router } from "express";
import { getCompletedTests } from "../../controllers/dataEntry/getCompletedTests.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getCompletedTestsRouter = Router();

// Get all completed tests
getCompletedTestsRouter.get("/", asyncHandler(getCompletedTests));

export default getCompletedTestsRouter;
