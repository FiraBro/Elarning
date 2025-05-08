const Review = require("../models/review");
const Course = require("../models/course");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const { courseId } = req.params;

  // Ensure course exists
  const course = await Course.findById(courseId);
  if (!course) return next(new AppError("Course not found", 404));

  // Optional: check if the user is enrolled
  if (!course.students.includes(req.user.id)) {
    return next(new AppError("Only enrolled students can review this course", 403));
  }

  const review = await Review.create({
    rating,
    comment,
    user: req.user.id,
    course: courseId,
  });

  res.status(201).json({
    status: "success",
    data: { review },
  });
});

exports.getCourseReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate("user", "name avatar");

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});
