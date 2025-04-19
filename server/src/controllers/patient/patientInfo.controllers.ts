import { Request, Response } from "express";
import prisma from "../../utils/prisma"

export const addPatientInfo = async (req: Request, res: Response) => {
  try {
    const {
      P_ID,
      name,
      address,
      DOB,
      Sex,
      mail,
      phone_no,
      emergency_phone_no,
    } = req.body;

    if (!P_ID || !name || !DOB || !phone_no || !emergency_phone_no) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const existingPatient = await prisma.patient.findUnique({
      where: {
        P_ID: parseInt(P_ID),
      },
    });

    if (existingPatient) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const newPatient = await prisma.patient.create({
      data: {
        P_ID: parseInt(P_ID),
        name,
        address,
        DOB: new Date(DOB),
        Sex: Sex || "M", // Default to 'M' if not provided
        mail,
        phone_no,
        emergency_phone_no,
      },
    });

    return res
      .status(201)
      .json({ message: "Patient info added successfully", patient: newPatient });
  } catch (err) {
    console.error("Error adding patient info:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
