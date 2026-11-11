import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool } from "./config/database.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { sessionMiddleware } from "./middleware/session.js";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));

// Initialize PostgreSQL-backed login sessions
app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/inventory", requireAuth, inventoryRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Jarvis-002 backend is running!",
  });
});

async function startServer() {
  try {
    const result = await pool.query("SELECT current_database() AS database");

    console.log("✅ PostgreSQL connected!");
    console.log(`📦 Database: ${result.rows[0].database}`);

    app.listen(PORT, () => {
      console.log(`🚀 Jarvis-002 backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
    process.exit(1);
  }
}

startServer();
