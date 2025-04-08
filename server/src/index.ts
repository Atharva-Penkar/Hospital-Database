import express from "express";
import dotenv from "dotenv";

// Auth routes
import authRouter from "./routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Auth routes
app.use("/api/auth", authRouter);

app.get('/', (req, res) => {
  res.send('Auth API is running');
});


// Server start
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
