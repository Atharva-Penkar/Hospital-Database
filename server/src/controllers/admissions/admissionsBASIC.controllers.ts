import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all admissions
export const getAllAdmissions = async (req: Request, res: Response) => {
  console.log("[getAllAdmissions] Called");
  try {
    const admissions = await prisma.admit.findMany({
      include: {
        patient: true,
        doctor: true,
        room: true,
        appointment: true,
      },
    });
    console.log("[getAllAdmissions] Fetched admissions:", admissions);
    return res.status(200).json({ admissions });
  } catch (err) {
    console.error("[getAllAdmissions] Error fetching admissions:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get admission by ID
export const getAdmissionById = async (req: Request, res: Response) => {
  console.log("[getAdmissionById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getAdmissionById] Invalid Admission ID format:", id);
      return res.status(400).json({ message: "Invalid Admission ID format" });
    }

    const admission = await prisma.admit.findUnique({
      where: { admit_id: parsedId },
      include: {
        patient: true,
        doctor: true,
        room: true,
        appointment: true,
      },
    });
    console.log("[getAdmissionById] Fetched admission:", admission);

    if (!admission) {
      console.log("[getAdmissionById] Admission not found for ID:", parsedId);
      return res.status(404).json({ message: "Admission not found" });
    }

    return res.status(200).json({ admission });
  } catch (err) {
    console.error("[getAdmissionById] Error fetching admission by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new admission
export const createAdmission = async (req: Request, res: Response) => {
  console.log("[createAdmission] Called with body:", req.body);
  try {
    const {
      P_ID,
      admit_time,
      discharge_time,
      R_no,
      A_ID,
      D_ID,
      status,
    } = req.body;

    // Basic validation
    if (
      !P_ID ||
      !R_no ||
      !A_ID ||
      !D_ID ||
      !status
    ) {
      console.log("[createAdmission] Missing required fields");
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAdmission = await prisma.admit.create({
      data: {
        P_ID,
        admit_time: admit_time ? new Date(admit_time) : null,
        discharge_time: discharge_time ? new Date(discharge_time) : null,
        R_no,
        A_ID,
        D_ID,
        status,
      },
    });
    console.log("[createAdmission] Created new admission:", newAdmission);

    return res.status(201).json({ admission: newAdmission });
  } catch (err) {
    console.error("[createAdmission] Error creating admission:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update an admission by ID
export const updateAdmission = async (req: Request, res: Response) => {
  console.log("[updateAdmission] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    const {
      P_ID,
      admit_time,
      discharge_time,
      R_no,
      A_ID,
      D_ID,
      status,
    } = req.body;

    if (!id || isNaN(parsedId)) {
      console.log("[updateAdmission] Invalid Admission ID format:", id);
      return res.status(400).json({ message: "Invalid Admission ID format" });
    }

    const updatedAdmission = await prisma.admit.update({
      where: { admit_id: parsedId },
      data: {
        ...(P_ID !== undefined && { P_ID }),
        ...(admit_time !== undefined && { admit_time: admit_time ? new Date(admit_time) : null }),
        ...(discharge_time !== undefined && { discharge_time: discharge_time ? new Date(discharge_time) : null }),
        ...(R_no !== undefined && { R_no }),
        ...(A_ID !== undefined && { A_ID }),
        ...(D_ID !== undefined && { D_ID }),
        ...(status !== undefined && { status }),
      },
    });
    console.log("[updateAdmission] Updated admission:", updatedAdmission);

    return res.status(200).json({ admission: updatedAdmission });
  } catch (err: any) {
    console.error("[updateAdmission] Error updating admission:", err);
    if (err.code === "P2025") {
      console.log("[updateAdmission] Admission not found for update, ID:", req.params.id);
      return res.status(404).json({ message: "Admission not found" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
