import { Router } from "express";
import { loginStaff } from "../../controllers/authStaff/loginStaff.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const loginStaffRouter = Router();

// POST /api/auth/staff/login
loginStaffRouter.post("/", asyncHandler(loginStaff));

export default loginStaffRouter;
