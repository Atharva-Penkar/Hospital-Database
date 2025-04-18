import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompletedAppointmentsForDoctor = async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        D_ID: doctorId,
        Status: "Finished", // or "Completed" if that's your enum value
      },
      orderBy: {
        TimeStamp: "desc", // Most recent first
      },
      select: {
        A_ID: true,
        P_ID: true,
        TimeStamp: true,
        Status: true,
        Symptoms: true,
        patient: {
          select: {
            name: true,
            P_ID: true,
            // add more fields if needed
          }
        }
      }
    });

    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
