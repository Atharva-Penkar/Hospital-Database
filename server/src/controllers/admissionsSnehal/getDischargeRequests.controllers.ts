import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getDischargeRequests = async (req: Request, res: Response) => {
  try {
    const admits = await prisma.admit.findMany({
      where: { status: "Discharge_Requested" },
      orderBy: { admit_time: "asc" },
      include: {
        patient: true,
        appointment: true,
        room: true,
        doctor: true
      },
    });
    res.status(200).json({ admits });
  } catch (error) {
    console.error("[getAdmitRequests] Error fetching admit requests:", error);
    res.status(500).json({ error: "Failed to fetch admit requests" });
  }
};
