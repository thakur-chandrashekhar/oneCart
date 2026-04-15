import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://onecart-frontend-jesr.onrender.com",
      "https://onecart-admin-tbxf.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler (VERY IMPORTANT)
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

// ✅ Safe DB connection + server start
const startServer = async () => {
  try {
    await connectDb(); // pehle DB connect hoga
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error.message);
    process.exit(1); // crash avoid + clear error
  }
};

startServer();

export default app;
