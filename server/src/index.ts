import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Routers
import authRouter from "./routes/authPatient/authPatient.routes";
import patientRouter from "./routes/patient/patientHome.routes";
import patientInfoRouter from "./routes/patient/patientInfo.routes";
import appointmentsRouter from "./routes/appointments/appointments.routes";


dotenv.config();
const app = express();
const prisma = new PrismaClient();

const PORT = parseInt(process.env.PORT || "5000", 10);

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      // Add your GitHub Codespace preview domain if needed
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/patient", patientRouter);
app.use("/api/patient-info", patientInfoRouter)
app.use("/api/appointments", appointmentsRouter)

app.get("/", (req, res) => {
  res.send("Hospital Management API is running");
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });

    // Optional: Keep-alive log to prevent Codespace from cleaning up
    setInterval(() => {
      console.log("🌀 Server is still alive...");
    }, 10000);

  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();
