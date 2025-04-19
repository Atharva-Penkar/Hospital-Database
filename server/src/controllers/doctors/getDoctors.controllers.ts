import { Request, Response } from "express";
import prisma from "../../utils/prisma"

// Controller to fetch doctors by specialization (using query parameter)
export const getDoctorsBySpecialization = async (req: Request, res: Response) => {
  const { specialization } = req.query;

  if (!specialization || typeof specialization !== "string") {
    return res.status(400).json({ message: "Specialization is required as a query parameter." });
  }

  try {
    const doctors = await prisma.doctor.findMany({
      where: {
        specialization: specialization,
      },
    });

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this specialization." });
    }

    return res.status(200).json({
      message: "Doctors fetched successfully.",
      doctors,
    });
  } catch (err) {
    console.error("Error fetching doctors by specialization:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
