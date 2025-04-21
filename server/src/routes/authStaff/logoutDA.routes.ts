import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { logoutDatabaseAdministrator } from "../../controllers/authStaff/logoutDA.controllers";

const logoutDARouter = Router();

// POST /api/auth-staff/logout/database-admin
logoutDARouter.post("/", asyncHandler(logoutDatabaseAdministrator));

export default logoutDARouter;
