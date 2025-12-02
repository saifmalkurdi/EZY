const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const ora = require("ora");
require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = [
  "JWT_SECRET",
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PASSWORD",
  "DB_PORT",
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  process.exit(1);
}

const app = express();

// Middleware
app.use(compression()); // Compress all responses
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve test page
app.get("/test", (req, res) => {
  res.sendFile(__dirname + "/test-api.html");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const courseRoutes = require("./routes/courseRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const achievementRoutes = require("./routes/achievementRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "❌ Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  const spinner = ora().start();
  spinner.fail("Unhandled Promise Rejection ❌");
  console.error("\nError details:", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  const spinner = ora().start();
  spinner.fail("Uncaught Exception ❌");
  console.error("\nError details:", err);
  process.exit(1);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  const spinner = ora("Starting server...").start();

  await new Promise((resolve) => setTimeout(resolve, 500));

  spinner.succeed("Server is running successfully! 🚀");
  console.log(`\n📍 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}\n`);

  await new Promise((resolve) => setTimeout(resolve, 1000));
});
