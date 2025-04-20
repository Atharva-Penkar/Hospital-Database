import { Router } from "express";
import { getPendingTestsController } from "../../controllers/tests/getTestsStatusPending.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const testsPendingRouter = Router();
testsPendingRouter.get("/", asyncHandler(getPendingTestsController));
export default testsPendingRouter;
