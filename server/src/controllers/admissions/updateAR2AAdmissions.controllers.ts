import { Request, Response } from "express";
import { AdmitStatus } from "@prisma/client";
import prisma from "../../utils/prisma"

// Update admission: Admit_Requested -> Admitted, set admit_time, update room number
export const admitPatient = async (req: Request, res: Response) => {
  console.log("[admitPatient] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params; // id = admit_id
    const parsedId = parseInt(id);
    const { R_no } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[admitPatient] Invalid Admission ID format:", id);
      return res.status(400).json({ message: "Invalid Admission ID format" });
    }
    if (!R_no || isNaN(Number(R_no))) {
      console.log("[admitPatient] Invalid or missing room number:", R_no);
      return res.status(400).json({ message: "Room number (R_no) is required and must be a number" });
    }

    // Fetch the admission to ensure it's currently Admit_Requested
    const admission = await prisma.admit.findUnique({
      where: { admit_id: parsedId },
    });

    console.log("[admitPatient] Current admission record:", admission);

    if (!admission) {
      console.log("[admitPatient] Admission not found for ID:", parsedId);
      return res.status(404).json({ message: "Admission not found" });
    }

    if (admission.status !== AdmitStatus.Admit_Requested) {
      console.log("[admitPatient] Admission status is not Admit_Requested:", admission.status);
      return res.status(400).json({ message: "Admission is not in Admit_Requested status" });
    }

    // Update the admission
    const updatedAdmission = await prisma.admit.update({
      where: { admit_id: parsedId },
      data: {
        status: AdmitStatus.Admitted,
        admit_time: new Date(),
        R_no: Number(R_no),
      },
    });

    console.log("[admitPatient] Updated admission:", updatedAdmission);

    return res.status(200).json({ admission: updatedAdmission });
  } catch (err) {
    console.error("[admitPatient] Error updating admission:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
