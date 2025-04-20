import { Router } from "express";
import { getTestsStatusCompleted } from "../../controllers/tests/getTestsStatusCompleted.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const testsCompletedRouter = Router();
testsCompletedRouter.get("/", asyncHandler(getTestsStatusCompleted));
export default testsCompletedRouter;
