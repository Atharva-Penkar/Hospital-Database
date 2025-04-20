import { Request, Response } from "express";
import { TreatmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const updateTreatmentTimeAndStatus = async (req: Request, res: Response) => {
  console.log("[updateTreatmentTimeAndStatus] Called with body:", req.body);
  try {
    // Destructure test_id from req.body because the client sends { test_id: 12, newTime: '...' }
    const { test_id, newTime } = req.body;

    const parsedTestId = parseInt(test_id, 10);
    if (!test_id || isNaN(parsedTestId)) {
      console.error("[updateTreatmentTimeAndStatus] Invalid test_id format:", test_id);
      return res.status(400).json({ message: "Invalid test_id format" });
    }

    if (!newTime || isNaN(Date.parse(newTime))) {
      console.error("[updateTreatmentTimeAndStatus] Invalid or missing newTime:", newTime);
      return res.status(400).json({ message: "newTime is required and must be a valid date string" });
    }

    // Fetch existing treatment record.
    const treatmentRecord = await prisma.treatment.findUnique({
      where: { treatment_id: parsedTestId },
    });
    console.log("[updateTreatmentTimeAndStatus] Fetched treatment record:", treatmentRecord);

    if (!treatmentRecord) {
      console.error("[updateTreatmentTimeAndStatus] Treatment not found for test_id:", parsedTestId);
      return res.status(404).json({ message: "Treatment not found" });
    }

    if (treatmentRecord.Status !== TreatmentStatus.Requested) {
      console.error("[updateTreatmentTimeAndStatus] Treatment status is not Requested:", treatmentRecord.Status);
      return res.status(400).json({ message: "Treatment status is not Requested" });
    }

    // Update treatment record: set new TimeStamp and change Status to Scheduled.
    const updatedTreatment = await prisma.treatment.update({
      where: { treatment_id: parsedTestId },
      data: {
        TimeStamp: new Date(newTime),
        Status: TreatmentStatus.Scheduled,
      },
    });
    console.log("[updateTreatmentTimeAndStatus] Updated treatment:", updatedTreatment);

    return res.status(200).json({ treatment: updatedTreatment });
  } catch (err) {
    console.error("[updateTreatmentTimeAndStatus] Error updating treatment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
