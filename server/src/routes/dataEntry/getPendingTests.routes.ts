import { Router } from "express";
import { getPendingTests } from "../../controllers/dataEntry/getPendingTests.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getPendingTestsRouter = Router();

// Get all pending tests
getPendingTestsRouter.get("/", asyncHandler(getPendingTests));

export default getPendingTestsRouter;
