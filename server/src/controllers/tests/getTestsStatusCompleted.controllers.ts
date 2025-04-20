import { Request, Response } from "express";
import { TestStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

// Fetch all tests with status 'Completed', including the result
export const getTestsStatusCompleted = async (req: Request, res: Response) => {
  console.log("[getCompletedTests] Called");
  try {
    const completedTests = await prisma.test.findMany({
      where: { Status: TestStatus.Completed },
      include: {
        appointment: {
          include: {
            patient: true,
            doctor: true
          }
        },
        test: true,
      },
      // Optionally, you can order by TimeStamp descending for most recent first
      orderBy: {
        TimeStamp: "desc"
      }
    });
    // Each test will have a .Result field (as per your Prisma model)
    console.log(`[getCompletedTests] Fetched ${completedTests.length} completed tests:`, completedTests);

    return res.status(200).json({ tests: completedTests });
  } catch (err) {
    console.error("[getCompletedTests] Error fetching completed tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
