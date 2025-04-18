// controllers/doctor/doctorAdmittedPatients.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAdmittedPatientsForDoctor = async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const admitted = await prisma.admit.findMany({
      where: {
        D_ID: doctorId,
        status: "Admitted", // Only currently admitted patients
      },
      orderBy: {
        admit_time: "asc",
      },
      select: {
        admit_id: true,
        P_ID: true,
        admit_time: true,
        R_no: true,
        status: true,
        patient: {
          select: {
            name: true,
            P_ID: true,
            // add more fields if needed
          }
        },
        room: {
          select: {
            Room_No: true,
            Room_Type: true,
          }
        }
      }
    });

    res.json({ admitted });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// controllers/doctor/doctorAdmittedPatients.controller.ts (add this to the same file)
export const requestDischargeForAdmittedPatient = async (req: Request, res: Response) => {
    const admitId = Number(req.params.admitId);
    if (isNaN(admitId)) {
      return res.status(400).json({ error: "Invalid admit ID" });
    }
  
    try {
      const updatedAdmit = await prisma.admit.update({
        where: { admit_id: admitId ,status: "Admitted",},
        data: { status: "Discharge_Requested" }, // Enum value as in your schema
      });
  
      res.json({ admit: updatedAdmit });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  };
  