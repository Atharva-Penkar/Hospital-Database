import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const loginStaff = async (req: Request, res: Response) => {
  console.log("[loginStaff] Request body:", req.body);

  const { userId, password, role } = req.body;

  if (userId === undefined || !password || !role) {
    console.log("[loginStaff] Missing required fields:", { userId, password, role });
    return res.status(400).json({ message: "userId, password, and role are required." });
  }

  try {
    console.log(`[loginStaff] Looking up staff with userId: ${userId} and role: ${role}`);
    // Use findFirst to check both userId and role
    const staff = await prisma.authStaff.findFirst({
      where: {
        userId: Number(userId),
        role: role,
      },
    });

    if (!staff) {
      console.log("[loginStaff] No staff record found for given credentials and role");
      return res.status(401).json({ message: "Invalid credentials or role." });
    }

    if (staff.password !== password) {
      console.log("[loginStaff] Password mismatch for userId:", userId);
      return res.status(401).json({ message: "Invalid credentials." });
    }

    console.log(`[loginStaff] Staff authenticated successfully: id=${staff.id}. Updating isOnline status to true.`);
    // Optionally set isOnline to true
    await prisma.authStaff.update({
      where: { id: staff.id },
      data: { isOnline: true },
    });

    // Remove password before sending user info
    const { password: _, ...userWithoutPassword } = staff;

    console.log("[loginStaff] Login successful, returning user data:", userWithoutPassword);
    res.status(200).json({ message: "Login successful", user: userWithoutPassword });
  } catch (error: any) {
    console.error("[loginStaff] Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};
