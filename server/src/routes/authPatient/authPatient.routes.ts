import { Router } from "express";
import * as authController from "../../controllers/authPatient/authPatient.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { authenticateToken } from "../../middlewares/authPatient/authPatient.middleware";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(authController.signupUser));
authRouter.post("/login", asyncHandler(authController.loginUser));
authRouter.post("/logout", authenticateToken, asyncHandler(authController.logoutUser));




export default authRouter;
