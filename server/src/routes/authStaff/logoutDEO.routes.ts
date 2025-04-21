import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { logoutDataEntryOperator } from "../../controllers/authStaff/logoutDEO.controllers";

const logoutDEORouter = Router();

// POST /api/auth-staff/logout/data-entry
logoutDEORouter.post("/", asyncHandler(logoutDataEntryOperator));

export default logoutDEORouter;
