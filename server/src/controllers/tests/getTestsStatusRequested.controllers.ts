import { Request, Response } from "express";
import { TestStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

// Fetch all tests with status 'Requested'
export const getRequestedTestsController = async (req: Request, res: Response) => {
  console.log("[getRequestedTests] Called");
  try {
    const requestedTests = await prisma.test.findMany({
      where: { Status: TestStatus.Requested },
      include: {
        appointment: {
          include: {
            patient: true
          }
        },
        test: true,
      },
    });
    console.log(`[getRequestedTests] Fetched ${requestedTests.length} requested tests:`, requestedTests);

    return res.status(200).json({ tests: requestedTests });
  } catch (err) {
    console.error("[getRequestedTests] Error fetching requested tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
