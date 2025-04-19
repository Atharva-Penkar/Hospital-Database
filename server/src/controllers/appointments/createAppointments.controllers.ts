import { Request, Response } from "express";
import { AppointmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma"

export const createAppointment = async (req: Request, res: Response) => {
    try {
        // Log the incoming request body
        console.log("Request body:", req.body);

        const P_ID = Number(req.body.P_ID);
        const D_ID = Number(req.body.D_ID);
        const TimeStamp = req.body.TimeStamp;

        // Log the types of each field
        console.log("P_ID type:", typeof P_ID);
        console.log("D_ID type:", typeof D_ID);
        console.log("TimeStamp type:", typeof TimeStamp);

        if (!P_ID && P_ID !== 0 || !D_ID && D_ID !== 0 || !TimeStamp) {
            console.log("Required fields missing");
            return res.status(400).json({ message: "Required fields missing" });
        }


        // Validate TimeStamp format (ensure it's a valid date)
        const timestampDate = new Date(TimeStamp);
        console.log("Parsed TimeStamp:", timestampDate);

        if (isNaN(timestampDate.getTime())) {
            console.log("Invalid timestamp format");
            return res.status(400).json({ message: "Invalid timestamp format" });
        }

        // Ensure that D_ID exists in the doctor table
        console.log("Checking if doctor exists with ID:", D_ID);
        const doctorExists = await prisma.doctor.findUnique({
            where: { D_ID: D_ID },
        });

        console.log("Doctor exists:", doctorExists);

        if (!doctorExists) {
            console.log(`Doctor with ID ${D_ID} does not exist`);
            return res.status(400).json({ message: `Doctor with ID ${D_ID} does not exist` });
        }

        // Create the new appointment with default AppointmentStatus as Requested
        console.log("Creating new appointment with the following data:");
        console.log({
            P_ID,
            D_ID,
            TimeStamp: timestampDate,
            Status: AppointmentStatus.Requested,
        });

        const newAppointment = await prisma.appointment.create({
            data: {
                P_ID,
                D_ID,
                TimeStamp: timestampDate,
                Status: AppointmentStatus.Requested, // Default status is Requested
            },
            include: {
                patient: true,
                doctor: true,
            },
        });

        // Log the newly created appointment
        console.log("New appointment created:", newAppointment);

        return res
            .status(201)
            .json({ message: "Appointment requested successfully", appointment: newAppointment });
    } catch (err) {
        console.error("Error creating appointment:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
