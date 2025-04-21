// controllers/appointments/setAppointmentDetails.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../../utils/prisma"

export const setAppointmentDetails = async (req: Request, res: Response) => {
  const appointmentId = Number(req.params.appointmentId);
  if (isNaN(appointmentId)) {
    return res.status(400).json({ error: "Invalid appointment ID" });
  }
console.log("Received data:", req.body);
  // If you want to allow updating other direct fields, get them from req.body
  // For now, we'll just set Status to "Finished"
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: { A_ID: appointmentId },
      data: {
        Status: "Finished",
        // Add more direct fields to update here if needed
      }
    });

    res.json({ appointment: updatedAppointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to set appointment details" });
  }
};

