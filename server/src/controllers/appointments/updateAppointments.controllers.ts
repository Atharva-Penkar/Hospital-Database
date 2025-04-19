import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma"

export const scheduleAppointment = async (req: Request, res: Response) => {
  try {
    console.log("[scheduleAppointment] Try block started");
    const { appointmentId, specialization, doctorId, date } = req.body;
    console.log("[scheduleAppointment] Received body parameters:", { appointmentId, specialization, doctorId, date });

    if (!appointmentId || !specialization || !doctorId || !date) {
      console.log("[scheduleAppointment] Missing required fields");
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Find the appointment and check status
    const appointment = await prisma.appointment.findUnique({
      where: { A_ID: appointmentId },
    });
    console.log("[scheduleAppointment] Fetched appointment:", appointment);

    if (!appointment) {
      console.log("[scheduleAppointment] Appointment not found");
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.Status !== AppointmentStatus.Requested) {
      console.log("[scheduleAppointment] Appointment status is not Requested");
      return res.status(400).json({ message: "Only requested appointments can be scheduled." });
    }

    // Update the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { A_ID: appointmentId },
      data: {
        Status: AppointmentStatus.Scheduled,
        D_ID: doctorId,
        TimeStamp: new Date(date),
      },
      include: {
        patient: true,
        doctor: true,
      },
    });
    console.log("[scheduleAppointment] Updated appointment:", updatedAppointment);

    console.log("[scheduleAppointment] Successfully sent response");
    return res.status(200).json({
      message: "Appointment scheduled successfully.",
      appointment: updatedAppointment,
    });
  } catch (err) {
    console.log("[scheduleAppointment] Caught error:", err);
    console.error("Error scheduling appointment:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
