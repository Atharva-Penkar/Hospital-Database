import { Router } from "express";
import * as roomController from "../../controllers/room/room.controllers";
import asyncHandler from "../../middlewares/RouteErrorHandler";

const roomRouter = Router();

roomRouter.get("/", asyncHandler(roomController.getAllRooms));

// Get all available rooms
roomRouter.get("/available", asyncHandler(roomController.getAvailableRooms));

// Get all not available rooms
roomRouter.get("/not-available", asyncHandler(roomController.getNotAvailableRooms));

// Get a room by ID
roomRouter.get("/:id", asyncHandler(roomController.getRoomById));

// Create a new room
roomRouter.post("/", asyncHandler(roomController.createRoom));

// Update a room by ID
roomRouter.put("/:id", asyncHandler(roomController.updateRoom));

// Delete a room by ID
roomRouter.delete("/:id", asyncHandler(roomController.deleteRoom));

export default roomRouter;
