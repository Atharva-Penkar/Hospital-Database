// controllers/doctorController.ts
import { Request, Response } from "express";
import prisma from "../../utils/prisma"

export const getDoctorById = async (req: Request, res: Response) => {
  const doctorId = parseInt(req.params.id);
  if (isNaN(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { D_ID: doctorId },
      select: {
        D_ID: true,
        name: true,
        specialization: true,
        mail: true,
        phone: true,
        shift: true,
        available: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
