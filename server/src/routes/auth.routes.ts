import { Router } from "express";
import * as authController from "../controllers/auth.controllers";
import asyncHandler from "../middlewares/RouteErrorHandler";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(authController.signupUser));
authRouter.post("/login", asyncHandler(authController.loginUser));
authRouter.post("/logout", asyncHandler(authController.logoutUser));




export default authRouter;
