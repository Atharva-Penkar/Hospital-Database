import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { logoutFrontDeskOperator } from "../../controllers/authStaff/logoutFDO.controllers";

const logoutFDORouter = Router();

// POST /api/auth-staff/logout
logoutFDORouter.post("/", asyncHandler(logoutFrontDeskOperator));

export default logoutFDORouter;
