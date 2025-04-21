import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const createAppointment = async (req: Request, res: Response) => {
  console.log("[createAppointment] Request body:", req.body);

  try {
    const P_ID = Number(req.body.P_ID);
    const D_ID = Number(req.body.D_ID);
    const TimeStamp = req.body.TimeStamp;
    const Symptoms = req.body.Symptoms; // Extract Symptoms from the request body

    console.log("[createAppointment] P_ID type:", typeof P_ID);
    console.log("[createAppointment] D_ID type:", typeof D_ID);
    console.log("[createAppointment] TimeStamp type:", typeof TimeStamp);

    if ((!P_ID && P_ID !== 0) || (!D_ID && D_ID !== 0) || !TimeStamp) {
      console.log("[createAppointment] Required fields missing");
      return res.status(400).json({ message: "Required fields missing" });
    }

    const timestampDate = new Date(TimeStamp);
    console.log("[createAppointment] Parsed TimeStamp:", timestampDate);
    if (isNaN(timestampDate.getTime())) {
      console.log("[createAppointment] Invalid timestamp format");
      return res.status(400).json({ message: "Invalid timestamp format" });
    }

    // Validate that the doctor exists.
    console.log("[createAppointment] Checking if doctor exists with ID:", D_ID);
    const doctorExists = await prisma.doctor.findUnique({
      where: { D_ID },
    });
    console.log("[createAppointment] Doctor exists:", doctorExists);

    if (!doctorExists) {
      console.log(`[createAppointment] Doctor with ID ${D_ID} does not exist`);
      return res.status(400).json({ message: `Doctor with ID ${D_ID} does not exist` });
    }

    console.log("[createAppointment] Creating new appointment with data:", {
      P_ID,
      D_ID,
      TimeStamp: timestampDate,
      Status: AppointmentStatus.Requested,
      Symptoms, // Log the Symptoms field
    });

    const newAppointment = await prisma.appointment.create({
      data: {
        P_ID,
        D_ID,
        TimeStamp: timestampDate,
        Status: AppointmentStatus.Requested,
        Symptoms: Symptoms || null, // Set Symptoms from request body or null if not provided
      },
      include: {
        patient: true,
        doctor: true,
      },
    });

    console.log("[createAppointment] New appointment created:", newAppointment);

    return res.status(201).json({
      message: "Appointment requested successfully",
      appointment: newAppointment,
    });
  } catch (err: any) {
    console.error("[createAppointment] Error creating appointment:", err);

    // Check if error is due to unique constraint failure on A_ID.
    if (err.code === "P2002" && err.meta && err.meta.target && err.meta.target.includes("A_ID")) {
      console.log("[createAppointment] Unique constraint failed on A_ID. Resetting sequence...");

      try {
        // Find the current maximum A_ID in the Appointment table.
        const result: any = await prisma.$queryRaw`SELECT MAX("A_ID") as max FROM "Appointment";`;
        const maxId = result[0]?.max;
        const nextId = (maxId || 0) + 1;
        console.log("[createAppointment] Resetting sequence. New starting value:", nextId);

        // Reset the sequence.
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE "Appointment_A_ID_seq" RESTART WITH ${nextId};`
        );

        return res.status(500).json({
          message: "Appointment creation conflict resolved. Please try again.",
        });
      } catch (seqErr) {
        console.error("[createAppointment] Error resetting sequence:", seqErr);
      }
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
