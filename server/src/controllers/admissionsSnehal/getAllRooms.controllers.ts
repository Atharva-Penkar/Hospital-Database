import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllRooms = async (req: Request, res: Response) => {
  console.log("[getAllRooms] Called");
  try {
    // Fetch all rooms and their current admitted patient (if any)
    const rooms = await prisma.room.findMany({
      include: {
        Admit: {
          where: {
            status: "Admitted",
            discharge_time: null,
          },
          select: {
            P_ID: true,
          },
        },
      },
      orderBy: { Room_No: "asc" },
    });

    // Flatten so each room shows the admitted patient's P_ID (if any)
    const result = rooms.map(room => ({
      Room_No: room.Room_No,
      Room_Type: room.Room_Type,
      Available: room.Available,
      admittedPatientId: room.Admit[0]?.P_ID ?? null,
    }));

    console.log(`[getAllRooms] Fetched ${result.length} rooms:`, result);

    res.status(200).json({ rooms: result });
  } catch (error) {
    console.error("[getAllRooms] Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};
