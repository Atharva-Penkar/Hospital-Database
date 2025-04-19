import { Request, Response } from "express";
import prisma from "../../utils/prisma"

// Controller to fetch all unique specializations from the Doctor table
export const getAllSpecializations = async (req: Request, res: Response) => {
  try {
    // Fetch distinct specializations
    const specializations = await prisma.doctor.findMany({
      distinct: ['specialization'],
      select: { specialization: true },
    });

    // Map to a plain array of strings
    const specializationList = specializations.map(d => d.specialization);

    return res.status(200).json({
      message: "Specializations fetched successfully.",
      specializations: specializationList,
    });
  } catch (err) {
    console.error("Error fetching specializations:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
