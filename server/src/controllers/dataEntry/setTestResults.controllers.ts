import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const setTestResults = async (req: Request, res: Response) => {
  const { testID } = req.params;
  const { result } = req.body;

  console.log("Received request to set test result:");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  if (!testID || typeof result !== "string" || !result.trim()) {
    console.warn("Invalid input. Missing testID or result.");
    return res.status(400).json({ error: "testId and non-empty result are required" });
  }

  try {
    console.log(`Updating test ID ${testID} with result: "${result}"...`);

    const updatedTest = await prisma.test.update({
      where: { test_id: Number(testID) },
      data: {
        Result: result,
        Status: "Completed",
        // TimeStamp: new Date(), // Optionally uncomment if timestamp update is needed
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

    console.log("Test updated successfully:");
    console.log(updatedTest);

    res.json({ test: updatedTest });
  } catch (error) {
    console.error("Error updating test result:", error);
    res.status(500).json({ error: "Failed to set test result" });
  }
};
