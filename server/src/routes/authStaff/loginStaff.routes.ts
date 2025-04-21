import { Router } from "express";
import { loginStaff } from "../../controllers/authStaff/loginStaff.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const authStaffRouter = Router();

// POST /api/auth/staff/login
authStaffRouter.post("/", asyncHandler(loginStaff));

export default authStaffRouter;
