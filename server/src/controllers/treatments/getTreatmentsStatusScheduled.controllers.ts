import { Request, Response } from "express";
import { TreatmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const getScheduledTreatmentsController = async (req: Request, res: Response) => {
  console.log("[getScheduledTreatmentsController] Called with query:", req.query);
  try {
    const scheduledTreatments = await prisma.treatment.findMany({
      where: {
        Status: TreatmentStatus.Scheduled,
      },
      include: {
        appointment: {
          include: {
            patient: true,
          },
        },
        treatment: true,
      },
    });
    console.log(
      `[getScheduledTreatmentsController] Fetched ${scheduledTreatments.length} treatments with status "Scheduled":`,
      scheduledTreatments
    );
    return res.status(200).json({ treatments: scheduledTreatments });
  } catch (err) {
    console.error("[getScheduledTreatmentsController] Error fetching scheduled treatments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
