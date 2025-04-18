import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all tests
export const getAllTestsAvailable = async (req: Request, res: Response) => {
  try {
    const tests = await prisma.testsAvailable.findMany();
    return res.status(200).json({ tests });
  } catch (err) {
    console.error("Error fetching all tests:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a test by ID
export const getTestAvailableById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    const test = await prisma.testsAvailable.findUnique({
      where: { T_ID: parsedId },
    });

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    return res.status(200).json({ test });
  } catch (err) {
    console.error("Error fetching test by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new test
export const createTestAvailable = async (req: Request, res: Response) => {
  try {
    const { test_name } = req.body;
    if (!test_name) {
      return res.status(400).json({ message: "test_name is required" });
    }

    const newTest = await prisma.testsAvailable.create({
      data: { test_name },
    });

    return res.status(201).json({ test: newTest });
  } catch (err) {
    console.error("Error creating test:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a test by ID
export const updateTestAvailable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const { test_name } = req.body;

    if (!id || isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid Test ID format" });
    }
    if (!test_name) {
      return res.status(400).json({ message: "test_name is required" });
    }

    const updatedTest = await prisma.testsAvailable.update({
      where: { T_ID: parsedId },
      data: { test_name },
    });

    return res.status(200).json({ test: updatedTest });
  } catch (err: any) {
    console.error("Error updating test:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a test by ID
export const deleteTestAvailable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      return res.status(400).json({ message: "Invalid Test ID format" });
    }

    await prisma.testsAvailable.delete({
      where: { T_ID: parsedId },
    });

    return res.status(204).send();
  } catch (err: any) {
    console.error("Error deleting test:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Test not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
