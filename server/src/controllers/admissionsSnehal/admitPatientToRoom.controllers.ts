import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const admitPatientToRoom = async (req: Request, res: Response) => {
  const { AdmitID, RoomNo } = req.params;
  console.log(`[admitPatientToRoom] Called for AdmitID=${AdmitID} with RoomNo=${RoomNo}`);

  if (!AdmitID || !RoomNo) {
    console.error("[admitPatientToRoom] Missing AdmitID or RoomNo");
    return res.status(400).json({ error: "AdmitID and RoomNo are required" });
  }

  try {
    // Update Admit row
    const updatedAdmit = await prisma.admit.update({
      where: { admit_id: Number(AdmitID) },
      data: {
        status: "Admitted",
        admit_time: new Date(),
        R_no: Number(RoomNo),
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
        room: true,
      },
    });

    // Update Room row
    const updatedRoom = await prisma.room.update({
      where: { Room_No: Number(RoomNo) },
      data: { Available: false },
    });

    console.log(`[admitPatientToRoom] Updated admit:`, updatedAdmit);
    console.log(`[admitPatientToRoom] Updated room:`, updatedRoom);

    res.status(200).json({ admit: updatedAdmit, room: updatedRoom });
  } catch (error) {
    console.error("[admitPatientToRoom] Error admitting patient:", error);
    res.status(500).json({ error: "Failed to admit patient to room" });
  }
};
