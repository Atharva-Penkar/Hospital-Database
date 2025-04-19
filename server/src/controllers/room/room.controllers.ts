import { Request, Response } from "express";
import { RoomType } from "@prisma/client";
import prisma from "../../utils/prisma"

export const getAllRooms = async (req: Request, res: Response) => {
  console.log("[getAllRooms] Called with params:", req.params);
  try {
    const rooms = await prisma.room.findMany();
    console.log("[getRoomById] Fetched room:", rooms);

    if (!rooms) {
      console.log("[getRoomById] Room not found:");
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ rooms });
  } catch (err) {
    console.error("[getAllRooms] Error fetching rooms:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a room by ID
export const getRoomById = async (req: Request, res: Response) => {
  console.log("[getRoomById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getRoomById] Invalid Room ID format:", id);
      return res.status(400).json({ message: "Invalid Room ID format" });
    }

    const room = await prisma.room.findUnique({
      where: { Room_No: parsedId },
    });
    console.log("[getRoomById] Fetched room:", room);

    if (!room) {
      console.log("[getRoomById] Room not found for ID:", parsedId);
      return res.status(404).json({ message: "Room not found" });
    }

    return res.status(200).json({ room });
  } catch (err) {
    console.error("[getRoomById] Error fetching room by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all available rooms
export const getAvailableRooms = async (req: Request, res: Response) => {
  console.log("[getAvailableRooms] Called");
  try {
    const rooms = await prisma.room.findMany({
      where: { Available: true },
    });
    console.log("[getAvailableRooms] Fetched rooms:", rooms);

    return res.status(200).json({ rooms });
  } catch (err) {
    console.error("[getAvailableRooms] Error fetching available rooms:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all not available rooms
export const getNotAvailableRooms = async (req: Request, res: Response) => {
  console.log("[getNotAvailableRooms] Called");
  try {
    const rooms = await prisma.room.findMany({
      where: { Available: false },
    });
    console.log("[getNotAvailableRooms] Fetched rooms:", rooms);

    return res.status(200).json({ rooms });
  } catch (err) {
    console.error("[getNotAvailableRooms] Error fetching not available rooms:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  console.log("[createRoom] Called with body:", req.body);
  try {
    const { Room_Type, Available } = req.body;

    // Validate Room_Type
    if (!Room_Type || !["General", "ICU", "Maternity"].includes(Room_Type)) {
      console.log("[createRoom] Invalid or missing Room_Type:", Room_Type);
      return res.status(400).json({ message: "Room_Type must be one of: General, ICU, Maternity" });
    }

    if (typeof Available !== "boolean") {
      console.log("[createRoom] Invalid or missing Available:", Available);
      return res.status(400).json({ message: "Available must be a boolean" });
    }

    const newRoom = await prisma.room.create({
      data: {
        Room_Type,
        Available,
      },
    });
    console.log("[createRoom] Created new room:", newRoom);

    return res.status(201).json({ room: newRoom });
  } catch (err) {
    console.error("[createRoom] Error creating room:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a room by ID
export const updateRoom = async (req: Request, res: Response) => {
  console.log("[updateRoom] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const { Room_Type, Available } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[updateRoom] Invalid Room ID format:", id);
      return res.status(400).json({ message: "Invalid Room ID format" });
    }

    // Validate Room_Type if provided
    if (Room_Type && !["General", "ICU", "Maternity"].includes(Room_Type)) {
      console.log("[updateRoom] Invalid Room_Type:", Room_Type);
      return res.status(400).json({ message: "Room_Type must be one of: General, ICU, Maternity" });
    }

    // Validate Available if provided
    if (Available !== undefined && typeof Available !== "boolean") {
      console.log("[updateRoom] Invalid Available:", Available);
      return res.status(400).json({ message: "Available must be a boolean" });
    }

    const updatedRoom = await prisma.room.update({
      where: { Room_No: parsedId },
      data: {
        ...(Room_Type && { Room_Type }),
        ...(Available !== undefined && { Available }),
      },
    });
    console.log("[updateRoom] Updated room:", updatedRoom);

    return res.status(200).json({ room: updatedRoom });
  } catch (err: any) {
    console.error("[updateRoom] Error updating room:", err);
    if (err.code === "P2025") {
      console.log("[updateRoom] Room not found for update, ID:", req.params.id);
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a room by ID
export const deleteRoom = async (req: Request, res: Response) => {
  console.log("[deleteRoom] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deleteRoom] Invalid Room ID format:", id);
      return res.status(400).json({ message: "Invalid Room ID format" });
    }

    await prisma.room.delete({
      where: { Room_No: parsedId },
    });
    console.log("[deleteRoom] Deleted room with ID:", parsedId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("[deleteRoom] Error deleting room:", err);
    if (err.code === "P2025") {
      console.log("[deleteRoom] Room not found for delete, ID:", req.params.id);
      return res.status(404).json({ message: "Room not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
