import { Router } from "express";
import * as authController from "../../controllers/authPatient/authPatient.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const authRouter = Router();

authRouter.post("/signup", asyncHandler(authController.signupPatient));
authRouter.post("/login", asyncHandler(authController.loginPatient));
authRouter.post("/logout", asyncHandler(authController.logoutPatient));




export default authRouter;
