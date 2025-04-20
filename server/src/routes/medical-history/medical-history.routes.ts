import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { getMedicalHistoryByPatient } from "../../controllers/medical-history/medical-history.controllers";

const medicalHistoryRouter = Router();

// GET /api/patient/:id
medicalHistoryRouter.get("/:id", asyncHandler(getMedicalHistoryByPatient));

export default medicalHistoryRouter;
