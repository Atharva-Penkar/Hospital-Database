import { Request, Response } from "express";
import prisma from "../../utils/prisma"

export const getPendingAppointmentsForDoctor = async (req: Request, res: Response) => {
  const doctorId = Number(req.params.id);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        D_ID: doctorId,
        Status: "Scheduled", // or "Pending", depending on your AppointmentStatus enum
      },
      orderBy: {
        TimeStamp: "asc",
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
