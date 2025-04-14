const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
// const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
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
