import { Request, Response } from "express";
import { PrismaClient, AdmitStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Get all admits with status Admit_Requested
export const getAllAdmitRequestedAdmissions = async (req: Request, res: Response) => {
  console.log("[getAllAdmitRequested] Called");
  try {
    const admits = await prisma.admit.findMany({
      where: { status: AdmitStatus.Admit_Requested },
      include: {
        patient: true,
        doctor: true,
        room: true,
        appointment: true,
      },
    });
    console.log("[getAllAdmitRequested] Fetched admits:", admits);
    return res.status(200).json({ admits });
  } catch (err) {
    console.error("[getAllAdmitRequested] Error fetching admits:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
