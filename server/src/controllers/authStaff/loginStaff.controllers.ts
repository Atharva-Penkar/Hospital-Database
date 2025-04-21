import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const loginStaff = async (req: Request, res: Response) => {
  const { userId, password, role } = req.body;

  if (userId === undefined || !password || !role) {
    return res.status(400).json({ message: "userId, password, and role are required." });
  }

  try {
    // Use findFirst to check both userId and role
    const staff = await prisma.authStaff.findFirst({
      where: {
        userId: Number(userId),
        role: role,
      },
    });

    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials or role." });
    }

    if (staff.password !== password) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Optionally set isOnline to true
    await prisma.authStaff.update({
      where: { id: staff.id },
      data: { isOnline: true }
    });

    // Remove password before sending user info
    const { password: _, ...userWithoutPassword } = staff;

    res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    console.error("[loginStaff] Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
