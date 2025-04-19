import { Request, Response } from "express";
import prisma from "../../utils/prisma"

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate Patient ID
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }

    // Fetch the patient data from the database
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

    // If patient is not found, return error
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Send the fetched patient data as the response
    return res.status(200).json({ patient });
  } catch (err) {
    // Log errors and send internal server error response
    console.error("Error fetching patient:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
