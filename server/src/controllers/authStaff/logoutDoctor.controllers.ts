import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const logoutDoctor = async (req: Request, res: Response) => {
  console.log("[logoutDoctor] Request body:", req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("[logoutDoctor] Missing userId in request body");
      return res.status(400).json({ message: "userId is required" });
    }

    const parsedUserId = Number(userId);
    console.log("[logoutDoctor] Parsed userId:", parsedUserId);

    // Find the doctor using the provided userId and ensuring their role is "doctor"
    const doctor = await prisma.authStaff.findFirst({
      where: {
        userId: parsedUserId,
        role: "doctor",
      },
    });

    if (!doctor) {
      console.error("[logoutDoctor] Doctor not found for userId:", parsedUserId);
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log("[logoutDoctor] Found doctor:", doctor);

    // Update the doctor's isOnline flag to false
    const updatedDoctor = await prisma.authStaff.update({
      where: { id: doctor.id },
      data: { isOnline: false },
    });

    console.log("[logoutDoctor] Doctor logged out successfully:", updatedDoctor);
    return res.status(200).json({ message: "Logged out successfully", doctor: updatedDoctor });
  } catch (error) {
    console.error("[logoutDoctor] Error logging out doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
