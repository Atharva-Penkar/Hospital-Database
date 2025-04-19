import { Request, Response } from "express";
import prisma from "../../utils/prisma"

export const getAppointmentDetails = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { A_ID: appointmentId },
      select: {
        A_ID: true,
        D_ID: true,
        P_ID: true,
        TimeStamp: true,
        Symptoms: true,
        admit: { select: { admit_id: true } },
        patient: { select: { name: true } },
        doctor: { select: { name: true } },
        diagnosis: { select: { diagnosis_Name: true } },
        tests: {
          select: {
            test_id: true,
            TimeStamp: true,
            Status: true,
            test: { select: { test_name: true } }
          }
        },
        Treatment: {
          select: {
            treatment_id: true,
            dosage: true,
            duration: true,
            treatment: { select: { treatment_name: true } }
          }
        }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Convert admit relation to boolean
    const result = {
      ...appointment,
      admit: !!appointment.admit
    };

    res.json({ appointment: result });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
