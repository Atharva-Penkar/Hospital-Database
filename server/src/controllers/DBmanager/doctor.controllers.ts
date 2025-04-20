import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getAllDoctors = async (req: Request, res: Response) => {
  console.log("[getAllDoctors] Called");
  try {
    const doctors = await prisma.doctor.findMany();
    console.log("[getAllDoctors] Fetched doctors:", doctors);
    
    // Return the array directly
    return res.status(200).json(doctors);
  } catch (err) {
    console.error("[getAllDoctors] Error fetching all doctors:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  console.log("[getDoctorById] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[getDoctorById] Invalid Doctor ID format:", id);
      return res.status(400).json({ message: "Invalid Doctor ID format" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { D_ID: parsedId },
    });
    console.log("[getDoctorById] Fetched doctor:", doctor);

    if (!doctor) {
      console.log("[getDoctorById] Doctor not found for ID:", parsedId);
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  } catch (err) {
    console.error("[getDoctorById] Error fetching doctor by ID:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  console.log("[createDoctor] Called with body:", req.body);
  try {
    const { name, specialization, mail, phone, shift, available, ad_id } = req.body;
    
    // Validate required fields
    if (!name || !specialization || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Name, specialization, and phone are required" 
      });
    }

    // Find highest D_ID to generate a new one
    const maxRecord = await prisma.doctor.findFirst({
      orderBy: { D_ID: 'desc' }
    });
    
    const nextId = maxRecord ? maxRecord.D_ID + 1 : 1;

    // Create a new doctor record
    const newDoctor = await prisma.doctor.create({
      data: {
        D_ID: nextId,
        name,
        specialization,
        mail,
        phone,
        shift,
        available: available ?? true,
        ad_id
      }
    });

    console.log("[createDoctor] Created new doctor:", newDoctor);
    
    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor: newDoctor
    });
  } catch (err) {
    console.error("[createDoctor] Error creating doctor:", err);
    
    // if (err.code === 'P2002') {
    //   return res.status(409).json({
    //     success: false,
    //     message: "A doctor with this ID already exists"
    //   });
    //}
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const updateDoctor = async (req: Request, res: Response) => {
  console.log("[updateDoctor] Called with params:", req.params, "and body:", req.body);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[updateDoctor] Invalid Doctor ID format:", id);
      return res.status(400).json({ message: "Invalid Doctor ID format" });
    }

    const { name, specialization, mail, phone, shift, available, ad_id } = req.body;
    
    // Validate required fields
    if (!name || !specialization || !phone) {
      return res.status(400).json({ message: "Name, specialization, and phone are required" });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { D_ID: parsedId },
      data: {
        name,
        specialization,
        mail,
        phone,
        shift,
        available: available ?? true,
        ad_id
      }
    });

    console.log("[updateDoctor] Updated doctor:", updatedDoctor);
    
    return res.status(200).json({
      success: true,
      message: "Doctor updated successfully",
      doctor: updatedDoctor
    });
  } catch (err) {
    console.error("[updateDoctor] Error updating doctor:", err);
    
    // if (err.code === 'P2025') {
    //   return res.status(404).json({ message: "Doctor not found" });
    // }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  console.log("[deleteDoctor] Called with params:", req.params);
  try {
    const { id } = req.params;
    const parsedId = parseInt(id);
    if (!id || isNaN(parsedId)) {
      console.log("[deleteDoctor] Invalid Doctor ID format:", id);
      return res.status(400).json({ message: "Invalid Doctor ID format" });
    }

    await prisma.doctor.delete({
      where: { D_ID: parsedId }
    });

    console.log("[deleteDoctor] Deleted doctor with ID:", parsedId);
    
    return res.status(200).json({
      success: true,
      message: "Doctor deleted successfully"
    });
  } catch (err) {
    console.error("[deleteDoctor] Error deleting doctor:", err);
    
    // if (err.code === 'P2025') {
    //   return res.status(404).json({ message: "Doctor not found" });
    // }
    
    return res.status(500).json({ message: "Internal server error" });
  }
};
