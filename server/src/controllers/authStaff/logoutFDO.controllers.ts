import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const logoutFrontDeskOperator = async (req: Request, res: Response) => {
  console.log("[logoutFrontDeskOperator] Request body:", req.body);

  try {
    const { userId } = req.body;

    if (!userId) {
      console.error("[logoutFrontDeskOperator] Missing userId in request body");
      return res.status(400).json({ message: "userId is required" });
    }

    const parsedUserId = Number(userId);
    console.log("[logoutFrontDeskOperator] Parsed userId:", parsedUserId);

    // Find the front-desk operator using the userId and ensure their role is 'front-desk-operator'
    const operator = await prisma.authStaff.findFirst({
      where: {
        userId: parsedUserId,
        role: "front-desk-operator",
      },
    });

    if (!operator) {
      console.error("[logoutFrontDeskOperator] Front-desk operator not found for userId:", parsedUserId);
      return res.status(404).json({ message: "Front desk operator not found" });
    }

    console.log("[logoutFrontDeskOperator] Found operator:", operator);

    // Update the operator's isOnline flag to false
    const updatedOperator = await prisma.authStaff.update({
      where: { id: operator.id },
      data: { isOnline: false },
    });

    console.log("[logoutFrontDeskOperator] Operator logged out successfully:", updatedOperator);
    return res.status(200).json({ message: "Logged out successfully", operator: updatedOperator });
  } catch (error) {
    console.error("[logoutFrontDeskOperator] Error logging out operator:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
