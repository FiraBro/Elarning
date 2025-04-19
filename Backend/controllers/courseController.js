const Course = require("../models/Course");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private/Instructor
 */
const createCourse = catchAsync(async (req, res, next) => {
  const { title, description, price, category, level } = req.body;

  // Basic validation
  if (!title || !description || !price) {
    return next(new AppError("Title, description and price are required", 400));
  }

  // Create course with additional metadata
  const course = await Course.create({
    title,
    description,
    shortDescription: description.substring(0, 160),
    price,
    instructor: req.user.id,
    category: category || "Other",
    level: level || "Beginner",
    requirements: req.body.requirements || [],
    learningOutcomes: req.body.learningOutcomes || [],
    tags: req.body.tags || [],
  });

  res.status(201).json({
    status: "success",
    data: {
      course,
    },
  });
});

/**
 * @desc    Get all courses
 * @route   GET /api/courses
 * @access  Public
 */

const getCourses = catchAsync(async (req, res, next) => {
  // 1) Build query
  const features = new APIFeatures(Course.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2) Execute query
  const courses = await features.query.populate({
    path: "instructor",
    select: "name email avatar",
  });

  // 3) Get total count for pagination
  const total = await Course.countDocuments(features.filterQuery);

  res.status(200).json({
    status: "success",
    results: courses.length,
    total,
    data: {
      courses,
    },
  });
});

module.exports = {
  createCourse,
  getCourses,
};
