const Course = require("../models/course");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private/Instructor
 */
exports.createCourse = catchAsync(async (req, res, next) => {
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
exports.getCourses = catchAsync(async (req, res, next) => {
  // 1) Build query with search support
  const features = new APIFeatures(Course.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // 2) Execute query
  const courses = await features.query.populate({
    path: "instructor",
    select: "name email avatar",
  });

  // 3) Get total count for pagination and filtering
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
exports.trackEnrollment = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  // Check if course exists
  if (!course) return next(new AppError("Course not found", 404));

  // Prevent duplicate enrollments
  if (course.students.includes(req.user.id)) {
    return next(new AppError("Already enrolled", 400));
  }

  // Update course metrics
  course.students.push(req.user.id);
  course.enrollmentCount += 1;
  await course.save();

  // Update user's course list (optional)
  await User.findByIdAndUpdate(req.user.id, {
    $addToSet: { purchasedCourses: course._id },
  });

  next(); // Proceed to payment processing
});

exports.getCourseMetrics = catchAsync(async (req, res) => {
  const metrics = await Course.aggregate([
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalRevenue: { $sum: "$price" },
        totalStudents: { $sum: { $size: "$students" } },
      },
    },
    {
      $project: {
        _id: 0,
        totalCourses: 1,
        totalRevenue: 1,
        totalStudents: 1,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: metrics[0] || {
      totalCourses: 0,
      totalRevenue: 0,
      totalStudents: 0,
    },
  });
});
