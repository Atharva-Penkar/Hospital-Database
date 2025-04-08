import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { userId, password, role } = req.body;
    console.log("received body: ", req.body)
    if (!userId || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await prisma.authUser.findUnique({ where: { userId } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.authUser.create({
      data: {
        userId,
        password: hashedPassword,
        role,
        isOnline: true,
      },
    });

    return res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    console.log("received body: ", req.body)
    if (!userId || !password) {
      return res.status(400).json({ message: "Missing userId or password" });
    }

    const user = await prisma.authUser.findUnique({ where: { userId } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await prisma.authUser.update({
      where: { userId },
      data: { isOnline: true },
    });

    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    console.log("received body: ", req.body)
    if (!userId) {
      return res.status(400).json({ message: "Missing userId in request body" });
    }

    const user = await prisma.authUser.findUnique({ where: { userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.authUser.update({
      where: { userId },
      data: { isOnline: false },
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
