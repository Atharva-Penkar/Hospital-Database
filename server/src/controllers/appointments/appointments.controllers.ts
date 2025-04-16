import { Request, Response } from "express";
import { PrismaClient, AppointmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { P_ID, D_ID, TimeStamp } = req.body;

    // Ensure required fields are present
    if (!P_ID || !D_ID || !TimeStamp) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Create the new appointment with default AppointmentStatus as Requested
    const newAppointment = await prisma.appointment.create({
      data: {
        P_ID,
        D_ID,
        TimeStamp: new Date(TimeStamp),
        Status: AppointmentStatus.Requested, // Default status is Requested
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    console.log("New appointment created:", newAppointment);

    return res
      .status(201)
      .json({ message: "Appointment scheduled successfully", appointment: newAppointment });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
