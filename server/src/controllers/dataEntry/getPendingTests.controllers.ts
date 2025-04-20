import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getPendingTests = async (_req: Request, res: Response) => {
  try {
    console.log("Fetching pending tests from the database...");

    const tests = await prisma.test.findMany({
      where: { Status: "Pending" },
      orderBy: { TimeStamp: "asc" },
      include: {
        test: { select: { test_name: true } }, // TestsAvailable
        appointment: {
          select: {
            patient: { select: { name: true, P_ID: true } },
            doctor: { select: { name: true, D_ID: true } }
          }
        }
      }
    });

    console.log(`Fetched ${tests.length} pending tests.`);

    const result = tests.map((t, index) => {
      const pendingTestLog = {
        index,
        test_id: t.test_id,
        A_ID: t.A_ID,
        T_ID: t.T_ID,
        Status: t.Status,
        TimeStamp: t.TimeStamp,
        test_name: t.test?.test_name || null,
        patient: t.appointment?.patient || null,
        doctor: t.appointment?.doctor || null,
      };
      console.log(`Pending Test [${index}]:`, pendingTestLog);
      return pendingTestLog;
    });

    console.log("Sending response with pending test data...");
    res.json({ tests: result });
  } catch (error) {
    console.error("Error fetching pending test results:", error);
    res.status(500).json({ error: "Failed to fetch pending test results" });
  }
};
