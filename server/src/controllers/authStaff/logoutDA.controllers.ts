import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const logoutDatabaseAdministrator = async (req: Request, res: Response) => {
  console.log("[logoutDatabaseAdministrator] Request body:", req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("[logoutDatabaseAdministrator] Missing userId in request body");
      return res.status(400).json({ message: "userId is required" });
    }

    const parsedUserId = Number(userId);
    console.log("[logoutDatabaseAdministrator] Parsed userId:", parsedUserId);

    // Find the database administrator with the role "database-administrator"
    const admin = await prisma.authStaff.findFirst({
      where: {
        userId: parsedUserId,
        role: "database-administrator",
      },
    });

    if (!admin) {
      console.error("[logoutDatabaseAdministrator] Database administrator not found for userId:", parsedUserId);
      return res.status(404).json({ message: "Database administrator not found" });
    }

    console.log("[logoutDatabaseAdministrator] Found admin:", admin);

    // Set their isOnline flag to false
    const updatedAdmin = await prisma.authStaff.update({
      where: { id: admin.id },
      data: { isOnline: false },
    });

    console.log("[logoutDatabaseAdministrator] Administrator logged out successfully:", updatedAdmin);
    return res.status(200).json({ message: "Logged out successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("[logoutDatabaseAdministrator] Error logging out administrator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
