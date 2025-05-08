const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Please provide a rating between 1 and 5"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (courseId) {
  const stats = await this.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Course").findByIdAndUpdate(courseId, {
      averageRating: stats[0].avgRating,
      numberOfReviews: stats[0].nRating,
    });
  } else {
    await mongoose.model("Course").findByIdAndUpdate(courseId, {
      averageRating: 0,
      numberOfReviews: 0,
    });
  }
};

// After a review is saved (created or updated)
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.course);
});

// Before removing a review (for findByIdAndDelete or findOneAndDelete)
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); // store the doc
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.course);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
