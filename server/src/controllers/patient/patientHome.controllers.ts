import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patient = await prisma.patient.findUnique({
      where: {
        P_ID: parseInt(id),
      },
      include: {
        appointments: {
          include: {
            doctor: true,
            tests: {
              include: {
                test: true,
              },
            },
            Treatment: {
              include: {
                treatment: true,
              },
            },
          },
        },
        medicalHistory: {
          include: {
            disease: true,
          },
        },
        allergies: true,
        admissions: {
          include: {
            ward: true,
          },
        },
      },
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({ patient });
  } catch (err) {
    console.error("Error fetching patient:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/** Used only for testing process
 * Remove before pushing to production
 */

// export const createPatient = async (req: Request, res: Response) => {
//     try {
//       console.log("Request body:", req.body); // Log the request body to make sure it's received correctly
//       const { name, address, DOB, sex, mail, phone_no, emergency_phone_no } = req.body;
  
//       if (!name || !DOB || !phone_no || !emergency_phone_no) {
//         return res.status(400).json({ message: "Required fields missing" });
//       }
  
//       // Create a new patient in the database
//       const newPatient = await prisma.patient.create({
//         data: {
//           name,
//           address,
//           DOB: new Date(DOB),  // Ensure DOB is parsed as a Date
//           Sex: sex || 'M', // Default to 'M' if not provided
//           mail,
//           phone_no,
//           emergency_phone_no,
//         },
//       });
  
//       console.log("New patient created:", newPatient); // Log the created patient
//       return res.status(201).json({ message: "Patient created successfully", patient: newPatient });
//     } catch (err) {
//       console.error("Error creating patient:", err);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   };
  
