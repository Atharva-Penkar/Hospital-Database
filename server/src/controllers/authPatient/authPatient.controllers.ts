import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Store this in .env in production

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { userId, password, role } = req.body;
    console.log("\nSIGN-UP ATTEMPT")
    console.log("Received body: ", req.body);  // Log signup body

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

    console.log("New user created: ", newUser);  // Log created user data
    return res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body;
    console.log("\nLOGIN ATTEMPT")
    console.log("Received body: ", req.body);  // Log login body

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

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Generated JWT Token: ", token);  // Log JWT for testing

    return res.status(200).json({
      message: "Login successful",
      user,
      token, // <-- send JWT token to frontend
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // Get token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    console.log("\nLOGOUT ATTEMPT")
    console.log("Received token for logout: ", token);  // Log token for testing

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    console.log("Decoded JWT Token: ", decoded);  // Log decoded token

    const { userId } = decoded;

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
