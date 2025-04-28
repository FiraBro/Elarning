const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  students: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    default: [],
  },
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  price: { type: Number, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrolledStudents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
  category: { type: String },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  lessons: [
    {
      title: { type: String, required: true },
      videoUrl: { type: String, required: true },
    },
  ],
  banner: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
