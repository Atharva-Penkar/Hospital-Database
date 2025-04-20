import { Router } from "express";
import { getAllRooms } from "../../controllers/admissionsSnehal/getAllRooms.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const getAllRoomsRouter = Router();

// GET /api/front-desk-operator/admissions/room
getAllRoomsRouter.get("/", asyncHandler(getAllRooms));

export default getAllRoomsRouter;
