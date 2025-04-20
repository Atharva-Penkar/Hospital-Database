import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const setTestResults = async (req: Request, res: Response) => {
  const { testID } = req.params;
  const { result } = req.body;

  if (!testID || typeof result !== "string" || !result.trim()) {
    return res.status(400).json({ error: "testId and non-empty result are required" });
  }

  try {
    const updatedTest = await prisma.test.update({
      where: { test_id: Number(testID) },
      data: {
        Result: result,
        Status: "Completed",
        // TimeStamp: new Date(), // Optionally update the timestamp to now
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

    res.json({ test: updatedTest });
  } catch (error) {
    res.status(500).json({ error: "Failed to set test result" });
  }
};
