const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const morgan = require("morgan");

// Local modules
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");
const reviewRoutes = require("./routes/reviewRoutes");
const AppError = require("./utils/appError");

const app = express();
app.set("trust proxy", 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiter (apply globally or per-route as needed)
const limiter = rateLimit({
  max: 100, // limit each IP
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Compression
app.use(compression());

// CORS middleware for all requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Middleware to add CORS headers on static files (including 304)
app.use("/uploads", (req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:5173"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/img/users",
  express.static(path.join(__dirname, "uploads/userImage"))
);

// Routes
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);

// 404 handler
// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
