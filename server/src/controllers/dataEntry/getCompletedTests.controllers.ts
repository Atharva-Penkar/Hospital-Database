import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getCompletedTests = async (_req: Request, res: Response) => {
  try {
    const tests = await prisma.test.findMany({
      where: { Status: "Completed" },
      orderBy: { TimeStamp: "desc" },
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

    const result = tests.map(t => ({
      test_id: t.test_id,
      A_ID: t.A_ID,
      T_ID: t.T_ID,
      Status: t.Status,
      TimeStamp: t.TimeStamp,
      Result: t.Result,
      test_name: t.test?.test_name || null,
      patient: t.appointment?.patient || null,
      doctor: t.appointment?.doctor || null,
    }));

    res.json({ tests: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch completed test results" });
  }
};
