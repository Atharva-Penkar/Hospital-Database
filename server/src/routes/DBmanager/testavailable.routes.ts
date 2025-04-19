import { Router } from "express";
import * as testsAvailableController from "../../controllers/DBmanager/testavailable.controller";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const testsAvailableRouter = Router();

// Get all tests
testsAvailableRouter.get("/", asyncHandler(testsAvailableController.getAllTestsAvailable));

// Get a test by ID
testsAvailableRouter.get("/:id", asyncHandler(testsAvailableController.getTestAvailableById));

// Create a new test
testsAvailableRouter.post("/", asyncHandler(testsAvailableController.createTestAvailable));

// Update a test by ID
testsAvailableRouter.put("/:id", asyncHandler(testsAvailableController.updateTestAvailable));

// Delete a test by ID
testsAvailableRouter.delete("/:id", asyncHandler(testsAvailableController.deleteTestAvailable));

export default testsAvailableRouter;
