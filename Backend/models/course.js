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
  averageRating: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
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
courseSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "course",
  localField: "_id",
});

courseSchema.set("toObject", { virtuals: true });
courseSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Course", courseSchema);
