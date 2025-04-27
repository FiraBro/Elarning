const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errorController");
// const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true })); //  For parsing URL-encoded dat
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: "http://localhost:5173", // Explicit frontend origin
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use("/img/users", express.static(path.join(__dirname, "upload/userImage")));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use(globalErrorHandler);
// app.use('/api/payments', paymentRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
