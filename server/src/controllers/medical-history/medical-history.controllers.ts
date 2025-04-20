import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getMedicalHistoryByPatient = async (req: Request, res: Response) => {
  console.log("[getMedicalHistoryByPatient] Called with params:", req.params);
  
  try {
    const { pid } = req.params;
    const parsedPid = parseInt(pid, 10);
    
    if (!pid || isNaN(parsedPid)) {
      console.error("[getMedicalHistoryByPatient] Invalid patient ID:", pid);
      return res.status(400).json({ message: "Invalid patient ID format" });
    }
    console.log("[getMedicalHistoryByPatient] Parsed patient ID:", parsedPid);
    
    // Fetch medical history records for the given patient
    const historyRecords = await prisma.medicalHistory.findMany({
      where: { P_ID: parsedPid },
      include: {
        disease: true, // Includes the disease details (e.g., disease_name and Description)
      },
    });
    
    console.log("[getMedicalHistoryByPatient] Retrieved medical history records:", historyRecords);
    return res.status(200).json({ medicalHistory: historyRecords });
  } catch (err) {
    console.error("[getMedicalHistoryByPatient] Error fetching medical history:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
