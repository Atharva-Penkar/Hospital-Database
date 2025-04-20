import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const setTestResults = async (req: Request, res: Response) => {
  const { testId } = req.params;
  const { result } = req.body;

  console.log(`[setTestResults] Called for testId=${testId} with result="${result}"`);

  // Validate input
  if (!testId || typeof result !== "string" || !result.trim()) {
    console.error("[setTestResults] Invalid input: testId and non-empty result are required");
    return res.status(400).json({ error: "testId and non-empty result are required" });
  }

  try {
    const updatedTest = await prisma.test.update({
      where: { test_id: Number(testId) },
      data: {
        Result: result,
        Status: "Completed",
        TimeStamp: new Date(), // Optionally update the timestamp to now
      },
      include: {
        test: { select: { test_name: true } },
        appointment: {
          select: {
            patient: { select: { name: true, P_ID: true } },
            doctor: { select: { name: true, D_ID: true } }
          }
        }
      }
    });

    console.log(`[setTestResults] Updated test:`, updatedTest);

    res.json({ test: updatedTest });
  } catch (error) {
    console.error("[setTestResults] Error updating test result:", error);
    res.status(500).json({ error: "Failed to set test result" });
  }
};
