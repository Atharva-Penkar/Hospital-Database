import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getCompletedTests = async (_req: Request, res: Response) => {
  try {
    console.log("Fetching completed tests from the database...");

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

    console.log(`Fetched ${tests.length} completed tests.`);

    const result = tests.map((t, index) => {
      const testLog = {
        index,
        test_id: t.test_id,
        A_ID: t.A_ID,
        T_ID: t.T_ID,
        Status: t.Status,
        TimeStamp: t.TimeStamp,
        Result: t.Result,
        test_name: t.test?.test_name || null,
        patient: t.appointment?.patient || null,
        doctor: t.appointment?.doctor || null,
      };
      console.log(`Test[${index}]:`, testLog);
      return testLog;
    });

    console.log("Sending response with completed test data...");
    res.json({ tests: result });
  } catch (error) {
    console.error("Error fetching completed test results:", error);
    res.status(500).json({ error: "Failed to fetch completed test results" });
  }
};
