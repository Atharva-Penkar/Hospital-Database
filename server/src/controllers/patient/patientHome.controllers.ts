import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getPatientById = async (req: Request, res: Response) => {
  console.log("[getPatientById] Called with params:", req.params);
  try {
    const { id } = req.params;
    console.log("[getPatientById] Extracted id:", id);

    // Validate Patient ID
    const parsedId = parseInt(id, 10);
    if (!id || isNaN(parsedId)) {
      console.error("[getPatientById] Invalid Patient ID format:", id);
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }
    console.log("[getPatientById] Parsed patient ID:", parsedId);

    // Fetch the patient data from the database
    console.log("[getPatientById] Fetching patient data from database...");
    const patient = await prisma.patient.findUnique({
      where: { P_ID: parsedId },
      include: {
        appointments: {
          include: {
            doctor: true,
            tests: {
              include: {
                test: true,
              },
            },
            Treatment: {
              include: {
                treatment: true,
              },
            },
          },
        },
        medicalHistory: {
          include: {
            disease: true,
          },
        },
        allergies: true,
        admissions: {
          include: {
            room: true,
          },
        },
      },
    });
    console.log("[getPatientById] Patient data fetched:", patient);

    // If patient is not found, return error
    if (!patient) {
      console.error("[getPatientById] Patient not found with ID:", parsedId);
      return res.status(404).json({ message: "Patient not found" });
    }

    console.log("[getPatientById] Returning patient data.");
    // Send the fetched patient data as the response
    return res.status(200).json({ patient });
  } catch (err) {
    console.error("[getPatientById] Error fetching patient:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
