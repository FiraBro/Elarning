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
    return next(
      new AppError("Only enrolled students can review this course", 403)
    );
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
  const reviews = await Review.find({ course: req.params.courseId }).populate(
    "user",
    "name photo"
  );

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

// New method to fetch all reviews with pagination (3 reviews per page)
exports.getAllReviews = catchAsync(async (req, res) => {
  // Get page and limit from query parameters, default to page 1 and limit 3
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const skip = (page - 1) * limit;

  // Fetch reviews with pagination
  const reviews = await Review.find()
    .skip(skip)
    .limit(limit)
    .populate("user", "name photo");

  // Get the total count of reviews
  const totalReviews = await Review.countDocuments();

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalReviews / limit);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalReviews: totalReviews,
    },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) return next(new AppError("Review not found", 404));

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new AppError("You do not have permission to delete this review", 403)
    );
  }

  await review.deleteOne(); // triggers any mongoose middleware

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
  });
});
