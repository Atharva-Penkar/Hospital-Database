import { Request, Response } from "express";
import { TreatmentStatus } from "@prisma/client";
import prisma from "../../utils/prisma";

export const getRequestedTreatmentsController = async (req: Request, res: Response) => {
  console.log("[getRequestedTreatmentsController] Called with query:", req.query);

  try {
    const requestedTreatments = await prisma.treatment.findMany({
      where: { Status: TreatmentStatus.Requested },
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
      `[getRequestedTreatmentsController] Fetched ${requestedTreatments.length} treatments with status "Requested":`,
      requestedTreatments
    );

    return res.status(200).json({ treatments: requestedTreatments });
  } catch (err) {
    console.error("[getRequestedTreatmentsController] Error fetching requested treatments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
