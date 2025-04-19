// controllers/appointments/addAppointmentDetails.controller.ts
import { Request, Response } from "express";
import { PrismaClient, Dosage } from "@prisma/client";
import prisma from "../../utils/prisma"

export const addAppointmentDetails = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }

  const { admit, diagnosis, tests, treatments } = req.body;

  try {
    // Get appointment for IDs
    const appointment = await prisma.appointment.findUnique({
      where: { A_ID: appointmentId },
      select: { P_ID: true, D_ID: true }
    });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    // 1. Add diagnosis
    if (diagnosis && diagnosis.length > 0) {
      await prisma.diagnosis.createMany({
        data: diagnosis.map((d: string) => ({
          diagnosis_Name: d,
          A_ID: appointmentId
        }))
      });
    }

    // 2. Add tests
    if (tests && tests.length > 0) {
      await prisma.test.createMany({
        data: tests.map((t: { T_ID: number }) => ({
          T_ID: t.T_ID,
          A_ID: appointmentId,
          TimeStamp: new Date(),
          Status: "Pending"
        }))
      });
    }

    // 3. Add treatments
    if (treatments && treatments.length > 0) {
      await prisma.treatment.createMany({
        data: treatments.map((tr: { Tr_ID: number; dosage: Dosage; duration: number }) => ({
          Tr_ID: tr.Tr_ID,
          A_ID: appointmentId,
          dosage: tr.dosage,
          duration: tr.duration
        }))
      });
    }

    // 4. Admit (if needed)
    if (admit) {
      // Only create if not already present
      const existingAdmit = await prisma.admit.findUnique({
        where: { A_ID: appointmentId }
      });
      if (!existingAdmit) {
        await prisma.admit.create({
          data: {
            P_ID: appointment.P_ID,
            D_ID: appointment.D_ID,
            A_ID: appointmentId,
            status: "Admit_Requested",
            R_no: 0, // R_no is null for now
            //admit_time, discharge_time left as null
          }
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add appointment details" });
  }
};

