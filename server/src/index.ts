import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Routers
import authRouter from "./routes/authPatient/authPatient.routes";
import patientRouter from "./routes/patient/patientHome.routes";
import patientInfoRouter from "./routes/patient/patientInfo.routes";
import createAppointmentsRouter from "./routes/appointments/createAppointments.routes";
import getAppointmentsRouter from "./routes/appointments/Appointments.routes";
import getDoctorsBySpecializationRouter from "./routes/doctors/getDoctors.routes";
import getSpecializationsRouter from "./routes/doctors/getSpecializations.routes";
import scheduleAppointmentRouter from "./routes/appointments/updateAppointments.routes";
import testsAvailableRouter from "./routes/testsAvailable/testsAvailable.routes";
import treatmentsAvailableRouter from "./routes/treatmentsAvailable/treatmentsAvailable.routes";
import doctorInfoRouter from "./routes/doctorSnehal/doctorInfo.routes";
import getAdmitRequestedAdmissionsRouter from "./routes/admissions/getAdmitRequestedAdmissions.routes";
import getDischargeRequestedAdmissionsRouter from "./routes/admissions/getDischargeRequestedAdmissions.routes";
import admissionsRouter from "./routes/admissions/admissionsBASIC.routes";


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
      "https://effective-enigma-6jx7j47vvj635gqv-5173.app.github.dev",
      "https://probable-parakeet-9vw4979p6q5c4x4-5173.app.github.dev",
      "https://improved-umbrella-6997vv74rqgpc59gx-5173.app.github.dev"
      // Add any other URLs you use (e.g., Codespaces)
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth-patient", authRouter);
app.use("/api/patient", patientRouter);
app.use("/api/patient-info", patientInfoRouter)

app.use("/api/appointments/request", createAppointmentsRouter)
app.use("/api/appointments", getAppointmentsRouter)
app.use("/api/appointments/schedule", scheduleAppointmentRouter)

app.use("/api/doctors/specialization", getDoctorsBySpecializationRouter)
app.use("/api/doctors/specializations", getSpecializationsRouter)

app.use("/api/tests-available", testsAvailableRouter)

app.use("/api/treatments-available", treatmentsAvailableRouter)

app.use("/api/front-desk-operator/admissions", getAdmitRequestedAdmissionsRouter)
app.use("/api/front-desk-operator/admissions", getDischargeRequestedAdmissionsRouter)
app.use("/api/access/admissions", admissionsRouter)

app.use("/api/doctor-info", doctorInfoRouter)

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
