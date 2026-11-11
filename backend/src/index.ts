import express from "express";
import cors from "cors";
import { pool } from "./config/database.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/inventory", inventoryRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Jarvis-002 backend is running!",
  });
});

// Start server after testing PostgreSQL
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
