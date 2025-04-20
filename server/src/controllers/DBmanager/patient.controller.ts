import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllPatients = async (req: Request, res: Response) => {
  console.log("[getAllPatients] Called");
  try {
    const patients = await prisma.patient.findMany();
    console.log("[getAllPatients] Fetched patients:", patients);
    
    return res.status(200).json(patients);
  } catch (err) {
    console.error("[getAllPatients] Error fetching all patients:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  console.log("[getPatientById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getPatientById] Invalid Patient ID format:", id);
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }

    const patient = await prisma.patient.findUnique({
      where: { P_ID: parsedId },
    });
    console.log("[getPatientById] Fetched patient:", patient);

    if (!patient) {
      console.log("[getPatientById] Patient not found for ID:", parsedId);
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json(patient);
  } catch (err) {
    console.error("[getPatientById] Error fetching patient by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  console.log("[createPatient] Called with body:", req.body);
  try {
    const { name, address, DOB, Sex, mail, phone_no, emergency_phone_no } = req.body;
    
    // Validate required fields
    if (!name || !DOB || !phone_no || !emergency_phone_no) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, date of birth, phone, and emergency phone are required" 
      });
    }

    // Find highest P_ID to generate a new one
    const maxRecord = await prisma.patient.findFirst({
      orderBy: { P_ID: 'desc' }
    });
    
    const nextId = maxRecord ? maxRecord.P_ID + 1 : 1;

    // Create a new patient record
    const newPatient = await prisma.patient.create({
      data: {
        P_ID: nextId,
        name,
        address,
        DOB: new Date(DOB),
        Sex: Sex || 'M',
        mail,
        phone_no,
        emergency_phone_no
      }
    });

    console.log("[createPatient] Created new patient:", newPatient);
    
    return res.status(201).json({
      success: true,
      message: "Patient created successfully",
      patient: newPatient
    });
  } catch (err) {
    console.error("[createPatient] Error creating patient:", err);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updatePatient = async (req: Request, res: Response) => {
  console.log("[updatePatient] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[updatePatient] Invalid Patient ID format:", id);
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }

    const { name, address, DOB, Sex, mail, phone_no, emergency_phone_no } = req.body;
    
    // Validate required fields
    if (!name || !DOB || !phone_no || !emergency_phone_no) {
      return res.status(400).json({ message: "Name, date of birth, phone, and emergency phone are required" });
    }

    const updatedPatient = await prisma.patient.update({
      where: { P_ID: parsedId },
      data: {
        name,
        address,
        DOB: new Date(DOB),
        Sex,
        mail,
        phone_no,
        emergency_phone_no
      }
    });

    console.log("[updatePatient] Updated patient:", updatedPatient);
    
    return res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient
    });
  } catch (err) {
    console.error("[updatePatient] Error updating patient:", err);
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePatient = async (req: Request, res: Response) => {
  console.log("[deletePatient] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deletePatient] Invalid Patient ID format:", id);
      return res.status(400).json({ message: "Invalid Patient ID format" });
    }

    await prisma.patient.delete({
      where: { P_ID: parsedId }
    });

    console.log("[deletePatient] Deleted patient with ID:", parsedId);
    
    return res.status(200).json({
      success: true,
      message: "Patient deleted successfully"
    });
  } catch (err) {
    console.error("[deletePatient] Error deleting patient:", err);
    
    return res.status(500).json({ message: "Internal server error" });
  }
};
