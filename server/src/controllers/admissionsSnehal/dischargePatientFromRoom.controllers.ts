import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const dischargePatient = async (req: Request, res: Response) => {
  const { admitId } = req.params;

  console.log(`[dischargePatient] Called for admitId=${admitId}`);

  if (!admitId) {
    console.error("[dischargePatient] Missing admitId");
    return res.status(400).json({ error: "admitId is required" });
  }

  try {
    // Find the Admit row to get the room number (R_no)
    const admit = await prisma.admit.findUnique({
      where: { admit_id: Number(admitId) },
    });

    if (!admit) {
      console.error(`[dischargePatient] Admit not found for admitId=${admitId}`);
      return res.status(404).json({ error: "Admit not found" });
    }

    // Update Admit row
    const updatedAdmit = await prisma.admit.update({
      where: { admit_id: Number(admitId) },
      data: {
        status: "Discharged",
        discharge_time: new Date(),
      },
      include: {
        patient: true,
        doctor: true,
        appointment: true,
        room: true,
      },
    });

    // Update Room row (set Available to true)
    let updatedRoom = null;
    if (admit.R_no) {
      updatedRoom = await prisma.room.update({
        where: { Room_No: admit.R_no },
        data: { Available: true },
      });
    }

    console.log(`[dischargePatient] Updated admit:`, updatedAdmit);
    if (updatedRoom) {
      console.log(`[dischargePatient] Updated room:`, updatedRoom);
    }

    res.status(200).json({ admit: updatedAdmit, room: updatedRoom });
  } catch (error) {
    console.error("[dischargePatient] Error discharging patient:", error);
    res.status(500).json({ error: "Failed to discharge patient" });
  }
};
