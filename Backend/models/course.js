const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  catagory: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    default: "Beginner",
  },
  video: { type: String, required: true }, // URL or path to course video
  banner: { type: String, required: true }, // URL or path to course banner image
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
