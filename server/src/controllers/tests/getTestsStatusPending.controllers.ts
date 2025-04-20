import { Request, Response } from "express";
import { TestStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

// Fetch all tests with status 'Pending'
export const getPendingTestsController = async (req: Request, res: Response) => {
  console.log("[getPendingTests] Called");
  try {
    const pendingTests = await prisma.test.findMany({
      where: { Status: TestStatus.Pending },
      include: {
        appointment: {
          include: {
            patient: true
          }
        },
        test: true,
      },
    });
    console.log(`[getPendingTests] Fetched ${pendingTests.length} pending tests:`, pendingTests);

    return res.status(200).json({ tests: pendingTests });
  } catch (err) {
    console.error("[getPendingTests] Error fetching pending tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
