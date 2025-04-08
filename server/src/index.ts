import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Auth routes
import authRouter from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10); // 👈 Fix here

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

// Auth routes
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Auth API is running");
});

// Start server on all interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth server running on http://0.0.0.0:${PORT}`);
});
