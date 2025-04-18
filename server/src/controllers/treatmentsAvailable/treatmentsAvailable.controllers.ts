import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all treatments available
export const getAllTreatmentsAvailable = async (req: Request, res: Response) => {
  console.log("[getAllTreatmentsAvailable] Called");
  try {
    const treatments = await prisma.treatmentsAvailable.findMany();
    console.log("[getAllTreatmentsAvailable] Fetched treatments:", treatments);
    return res.status(200).json({ treatments });
  } catch (err) {
    console.error("[getAllTreatmentsAvailable] Error fetching treatments:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get a treatment by ID
export const getTreatmentAvailableById = async (req: Request, res: Response) => {
  console.log("[getTreatmentAvailableById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getTreatmentAvailableById] Invalid Treatment ID format:", id);
      return res.status(400).json({ message: "Invalid Treatment ID format" });
    }

    const treatment = await prisma.treatmentsAvailable.findUnique({
      where: { Tr_ID: parsedId },
    });
    console.log("[getTreatmentAvailableById] Fetched treatment:", treatment);

    if (!treatment) {
      console.log("[getTreatmentAvailableById] Treatment not found for ID:", parsedId);
      return res.status(404).json({ message: "Treatment not found" });
    }

    return res.status(200).json({ treatment });
  } catch (err) {
    console.error("[getTreatmentAvailableById] Error fetching treatment by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new treatment
export const createTreatmentAvailable = async (req: Request, res: Response) => {
  console.log("[createTreatmentAvailable] Called with body:", req.body);
  try {
    const { treatment_name } = req.body;
    if (!treatment_name) {
      console.log("[createTreatmentAvailable] treatment_name is required");
      return res.status(400).json({ message: "treatment_name is required" });
    }

    const newTreatment = await prisma.treatmentsAvailable.create({
      data: { treatment_name },
    });
    console.log("[createTreatmentAvailable] Created new treatment:", newTreatment);

    return res.status(201).json({ treatment: newTreatment });
  } catch (err) {
    console.error("[createTreatmentAvailable] Error creating treatment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a treatment by ID
export const updateTreatmentAvailable = async (req: Request, res: Response) => {
  console.log("[updateTreatmentAvailable] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const { treatment_name } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[updateTreatmentAvailable] Invalid Treatment ID format:", id);
      return res.status(400).json({ message: "Invalid Treatment ID format" });
    }
    if (!treatment_name) {
      console.log("[updateTreatmentAvailable] treatment_name is required");
      return res.status(400).json({ message: "treatment_name is required" });
    }

    const updatedTreatment = await prisma.treatmentsAvailable.update({
      where: { Tr_ID: parsedId },
      data: { treatment_name },
    });
    console.log("[updateTreatmentAvailable] Updated treatment:", updatedTreatment);

    return res.status(200).json({ treatment: updatedTreatment });
  } catch (err: any) {
    console.error("[updateTreatmentAvailable] Error updating treatment:", err);
    if (err.code === "P2025") {
      console.log("[updateTreatmentAvailable] Treatment not found for update, ID:", req.params.id);
      return res.status(404).json({ message: "Treatment not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a treatment by ID
export const deleteTreatmentAvailable = async (req: Request, res: Response) => {
  console.log("[deleteTreatmentAvailable] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deleteTreatmentAvailable] Invalid Treatment ID format:", id);
      return res.status(400).json({ message: "Invalid Treatment ID format" });
    }

    await prisma.treatmentsAvailable.delete({
      where: { Tr_ID: parsedId },
    });
    console.log("[deleteTreatmentAvailable] Deleted treatment with ID:", parsedId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("[deleteTreatmentAvailable] Error deleting treatment:", err);
    if (err.code === "P2025") {
      console.log("[deleteTreatmentAvailable] Treatment not found for delete, ID:", req.params.id);
      return res.status(404).json({ message: "Treatment not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
