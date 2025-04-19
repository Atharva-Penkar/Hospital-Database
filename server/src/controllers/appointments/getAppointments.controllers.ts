import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma"

// Controller to fetch appointments with Requested status
export const getRequestedAppointments = async (req: Request, res: Response) => {
  console.log("Received request to fetch requested appointments");

  try {
    // Fetch all appointments with Requested status
    console.log("Fetching appointments with 'Requested' status...");
    const requestedAppointments = await prisma.appointment.findMany({
      where: {
        Status: AppointmentStatus.Requested, // Directly using the status as a string value
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    console.log("Requested appointments:", requestedAppointments);

    if (requestedAppointments.length === 0) {
      console.log("No requested appointments found");
      return res.status(404).json({ message: "No requested appointments found" });
    }

    console.log("Successfully fetched requested appointments");

    return res.status(200).json({
      message: "Requested appointments fetched successfully",
      appointments: requestedAppointments,
    });
  } catch (err) {
    console.error("Error fetching requested appointments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getScheduledAppointments = async (req: Request, res: Response) => {
  console.log("Received request to fetch scheduled appointments");

  try {
    // Fetch all appointments with Scheduled status
    console.log("Fetching appointments with 'Scheduled' status...");
    const scheduledAppointments = await prisma.appointment.findMany({
      where: {
        Status: AppointmentStatus.Scheduled,
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    console.log("Scheduled appointments:", scheduledAppointments);

    if (scheduledAppointments.length === 0) {
      console.log("No scheduled appointments found");
      return res.status(404).json({ message: "No scheduled appointments found" });
    }

    console.log("Successfully fetched scheduled appointments");

    return res.status(200).json({
      message: "Scheduled appointments fetched successfully",
      appointments: scheduledAppointments,
    });
  } catch (err) {
    console.error("Error fetching scheduled appointments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};