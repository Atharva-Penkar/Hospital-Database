import { Request, Response } from "express";
import { AdmitStatus } from "@prisma/client";
import prisma from "../../utils/prisma"

// Get all admits with status Discharge_Requested
export const getAllDischargeRequestedAdmissions = async (req: Request, res: Response) => {
  console.log("[getAllDischargeRequestedAdmissions] Called");
  try {
    const admits = await prisma.admit.findMany({
      where: { status: AdmitStatus.Discharge_Requested },
      include: {
        patient: true,
        doctor: true,
        room: true,
        appointment: true,
      },
    });
    console.log("[getAllDischargeRequestedAdmissions] Fetched admits:", admits);
    return res.status(200).json({ admits });
  } catch (err) {
    console.error("[getAllDischargeRequestedAdmissions] Error fetching admits:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
