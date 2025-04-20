import { Router } from "express";
import { getRequestedTestsController } from "../../controllers/tests/getTestsStatusRequested.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const testsRequestedRouter = Router();

testsRequestedRouter.get("/requested", asyncHandler(getRequestedTestsController));

export default testsRequestedRouter;
