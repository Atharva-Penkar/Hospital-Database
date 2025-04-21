import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getDiseases = async (req: Request, res: Response) => {
  console.log("[getDiseases] Request received to fetch diseases");
  try {
    const diseases = await prisma.disease.findMany({
      orderBy: { disease_id: "asc" },
    });
    console.log("[getDiseases] Retrieved diseases:", diseases);
    return res.status(200).json({ diseases });
  } catch (error) {
    console.error("[getDiseases] Error fetching diseases:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
