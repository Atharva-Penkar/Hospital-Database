import { Router } from "express";
import asyncHandler from "../../middlewares/RouteErrorHandler";
import { getDiseases } from "../../controllers/disease/getDiseases.controllers";

const diseasesRouter = Router();

// GET /api/diseases - Fetch all diseases
diseasesRouter.get("/", asyncHandler(getDiseases));

export default diseasesRouter;
