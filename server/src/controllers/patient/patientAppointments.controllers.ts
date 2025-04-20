import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAppointmentsByPidOrdered = async (req: Request, res: Response) => {
  console.log("[getAppointmentsByPidOrdered] Called with params:", req.params);
  try {
    const { pid } = req.params;
    const parsedPid = parseInt(pid, 10);
    if (isNaN(parsedPid)) {
      console.error("[getAppointmentsByPidOrdered] Invalid patient id:", pid);
      return res.status(400).json({ message: "Invalid patient id" });
    }

    // Fetch all appointments for the patient.
    const appointments = await prisma.appointment.findMany({
      where: { P_ID: parsedPid },
    });

    // Define custom ordering:
    // Scheduled first, Requested second, Finished/Completed third.
    const statusOrder: { [key: string]: number } = {
      "Scheduled": 1,
      "Requested": 2,
      "Finished": 3,
      "Completed": 3,
    };

    // Sort appointments by status order first, then by timestamp ascending.
    appointments.sort((a, b) => {
      const orderA = statusOrder[a.Status] || 99;
      const orderB = statusOrder[b.Status] || 99;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime();
    });

    console.log("[getAppointmentsByPidOrdered] Sorted appointments:", appointments);
    return res.status(200).json({ appointments });
  } catch (err) {
    console.error("[getAppointmentsByPidOrdered] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
