import { Request, Response } from "express";
import prisma from "../../utils/prisma"

// Get all tests
export const getAllTestsAvailable = async (req: Request, res: Response) => {
  console.log("[getAllTestsAvailable] Called");
  try {
    const tests = await prisma.testsAvailable.findMany();
    console.log("[getAllTestsAvailable] Fetched tests:", tests);
    return res.status(200).json({ tests });
  } catch (err) {
    console.error("[getAllTestsAvailable] Error fetching all tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a test by ID
export const getTestAvailableById = async (req: Request, res: Response) => {
  console.log("[getTestAvailableById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getTestAvailableById] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    const test = await prisma.testsAvailable.findUnique({
      where: { T_ID: parsedId },
    });
    console.log("[getTestAvailableById] Fetched test:", test);

    if (!test) {
      console.log("[getTestAvailableById] Test not found for ID:", parsedId);
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json({ test });
  } catch (err) {
    console.error("[getTestAvailableById] Error fetching test by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new test
export const createTestAvailable = async (req: Request, res: Response) => {
  console.log("[createTestAvailable] Called with body:", req.body);
  try {
    const { test_name } = req.body;
    if (!test_name) {
      console.log("[createTestAvailable] test_name is required");
      return res.status(400).json({ message: "test_name is required" });
    }

    const newTest = await prisma.testsAvailable.create({
      data: { test_name },
    });
    console.log("[createTestAvailable] Created new test:", newTest);

    return res.status(201).json({ test: newTest });
  } catch (err) {
    console.error("[createTestAvailable] Error creating test:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a test by ID
export const updateTestAvailable = async (req: Request, res: Response) => {
  console.log("[updateTestAvailable] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const { test_name } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[updateTestAvailable] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }
    if (!test_name) {
      console.log("[updateTestAvailable] test_name is required");
      return res.status(400).json({ message: "test_name is required" });
    }

    const updatedTest = await prisma.testsAvailable.update({
      where: { T_ID: parsedId },
      data: { test_name },
    });
    console.log("[updateTestAvailable] Updated test:", updatedTest);

    return res.status(200).json({ test: updatedTest });
  } catch (err: any) {
    console.error("[updateTestAvailable] Error updating test:", err);
    if (err.code === "P2025") {
      console.log("[updateTestAvailable] Test not found for update, ID:", req.params.id);
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a test by ID
export const deleteTestAvailable = async (req: Request, res: Response) => {
  console.log("[deleteTestAvailable] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deleteTestAvailable] Invalid Test ID format:", id);
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    await prisma.testsAvailable.delete({
      where: { T_ID: parsedId },
    });
    console.log("[deleteTestAvailable] Deleted test with ID:", parsedId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("[deleteTestAvailable] Error deleting test:", err);
    if (err.code === "P2025") {
      console.log("[deleteTestAvailable] Test not found for delete, ID:", req.params.id);
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
