import { Router } from "express";
import { updateTestTimeAndStatus } from "../../controllers/tests/scheduleTest.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const updateTestTimeAndStatusRouter = Router()

updateTestTimeAndStatusRouter.put("/", asyncHandler(updateTestTimeAndStatus));

export default updateTestTimeAndStatusRouter