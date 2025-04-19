import { Request, Response } from "express";
import prisma from "../../utils/prisma"

// ---------------- SIGNUP ----------------
export const signupPatient = async (req: Request, res: Response) => {
  try {
    const { userId, password, role } = req.body;
    console.log("\n[SIGNUP] Body:", req.body);

    if (!userId || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.authPatient.findUnique({ where: { userId } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await prisma.authPatient.create({
      data: {
        userId,
        password, // no hashing
        role,
        isOnline: true,
      },
    });

    console.log("[SIGNUP] New user created:", newUser.userId);
    return res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("[SIGNUP] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- LOGIN ----------------
export const loginPatient = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    console.log("\n[LOGIN] Body:", req.body);

    if (!userId || !password) {
      return res.status(400).json({ message: "Missing userId or password" });
    }

    const user = await prisma.authPatient.findUnique({ where: { userId } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("🔐 Raw input password:", password);
    console.log("🗄️ Stored password in DB:", user.password);

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await prisma.authPatient.update({
      where: { userId },
      data: { isOnline: true },
    });

    console.log("[LOGIN] User logged in:", user.userId);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        userId: user.userId,
        role: user.role,
        createdAt: user.createdAt,
        isOnline: user.isOnline,
      },
    });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- LOGOUT ----------------
export const logoutPatient = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // No token, expect userId to be sent in body

    console.log("\n[LOGOUT] User ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "Missing userId" });
    }

    const user = await prisma.authPatient.findUnique({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.authPatient.update({
      where: { userId },
      data: { isOnline: false },
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("[LOGOUT] Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
