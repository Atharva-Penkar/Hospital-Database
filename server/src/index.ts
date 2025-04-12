import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.routes";
import patientRouter from "./routes/patient/patientHome.routes"; // 👈 Import added

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/patient", patientRouter); // 👈 Mount patient router

app.get("/", (req, res) => {
  res.send("Hospital Management API is running");
});

// Start server on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
