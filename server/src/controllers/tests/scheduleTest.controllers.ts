import { Request, Response } from "express";
import { TestStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const updateTestTimeAndStatus = async (req: Request, res: Response) => {
  console.log("[updateTestTimeAndStatus] Called with params:", req.params, "and body:", req.body);
  try {
    // Now obtaining test_id from the body rather than req.params
    const { test_id, newTime } = req.body;

    const parsedTestId = parseInt(test_id, 10);
    if (!test_id || isNaN(parsedTestId)) {
      console.error("[updateTestTimeAndStatus] Invalid test_id format:", test_id);
      return res.status(400).json({ message: "Invalid test_id format" });
    }

    if (!newTime || isNaN(Date.parse(newTime))) {
      console.error("[updateTestTimeAndStatus] Invalid or missing newTime:", newTime);
      return res.status(400).json({ message: "newTime is required and must be a valid date string" });
    }

    // Retrieve the existing test record
    const testRecord = await prisma.test.findUnique({
      where: { test_id: parsedTestId },
    });
    console.log("[updateTestTimeAndStatus] Fetched test record:", testRecord);

    if (!testRecord) {
      console.error("[updateTestTimeAndStatus] Test not found for test_id:", parsedTestId);
      return res.status(404).json({ message: "Test not found" });
    }

    if (testRecord.Status !== TestStatus.Requested) {
      console.error("[updateTestTimeAndStatus] Test status is not Requested:", testRecord.Status);
      return res.status(400).json({ message: "Test status is not Requested" });
    }

    // Update the test with the new TimeStamp and change status to Pending
    const updatedTest = await prisma.test.update({
      where: { test_id: parsedTestId },
      data: {
        TimeStamp: new Date(newTime),
        Status: TestStatus.Pending,
      },
    });
    console.log("[updateTestTimeAndStatus] Updated test:", updatedTest);

    return res.status(200).json({ test: updatedTest });
  } catch (err) {
    console.error("[updateTestTimeAndStatus] Error updating test:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
