import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const logoutDataEntryOperator = async (req: Request, res: Response) => {
  console.log("[logoutDataEntryOperator] Request body:", req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("[logoutDataEntryOperator] Missing userId in request body");
      return res.status(400).json({ message: "userId is required" });
    }

    const parsedUserId = Number(userId);
    console.log("[logoutDataEntryOperator] Parsed userId:", parsedUserId);

    // Find the data entry operator with the role "data-entry-operator"
    const operator = await prisma.authStaff.findFirst({
      where: {
        userId: parsedUserId,
        role: "data-entry-operator",
      },
    });

    if (!operator) {
      console.error("[logoutDataEntryOperator] Data entry operator not found for userId:", parsedUserId);
      return res.status(404).json({ message: "Data entry operator not found" });
    }

    console.log("[logoutDataEntryOperator] Found operator:", operator);

    // Set their isOnline flag to false
    const updatedOperator = await prisma.authStaff.update({
      where: { id: operator.id },
      data: { isOnline: false },
    });

    console.log("[logoutDataEntryOperator] Operator logged out successfully:", updatedOperator);
    return res.status(200).json({ message: "Logged out successfully", operator: updatedOperator });
  } catch (error) {
    console.error("[logoutDataEntryOperator] Error logging out operator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
