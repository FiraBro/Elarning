const Course = require("../models/course");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

/**
 * @desc    Create a new course
 * @route   POST /api/courses
 * @access  Private/Instructor
 */

exports.createCourse = catchAsync(async (req, res, next) => {
  const { title, description, price, category, level } = req.body;
  const video = req.files["video"] ? req.files["video"][0].filename : null; // Access the uploaded file via req.file
  const banner = req.files["banner"] ? req.files["banner"][0].filename : null;

  // Basic validation
  if (!title || !description || !price || !video) {
    return next(
      new AppError("Title, description, video and price are required", 400)
    );
  }
  // Create course with additional metadata
  const course = await Course.create({
    title,
    description,
    shortDescription: description.substring(0, 160),
    price,
    video: video, // Save the filename or path to the database
    banner: banner,
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

/**
 * @desc    Update a course by ID
 * @route   PATCH /api/courses/:id
 * @access  Private/Instructor
 */

exports.updateCourse = catchAsync(async (req, res, next) => {
  const { title, description, price, category, level } = req.body;

  // Find existing course
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  // Update fields
  course.title = title || course.title;
  course.description = description || course.description;
  course.price = price || course.price;
  course.category = category || course.category;
  course.level = level || course.level;

  // Handle uploaded files
  if (req.files?.banner) {
    const bannerPath = req.files.banner[0].path;
    course.banner = bannerPath.replace(/\\/g, "/"); // Normalize Windows paths
  }

  if (req.files?.video) {
    const videoPath = req.files.video[0].path;
    course.video = videoPath.replace(/\\/g, "/");
  }

  // Save updated course
  const updatedCourse = await course.save();

  res.status(200).json({
    status: "success",
    course: updatedCourse,
  });
});

/**
 * @desc    Delete a course by ID
 * @route   DELETE /api/courses/:id
 * @access  Private/Instructor/Admin
 */
exports.deleteCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  // Authorization check: only instructor who created it or admin can delete
  if (
    course.instructor.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(
      new AppError("You do not have permission to delete this course", 403)
    );
  }

  await Course.findByIdAndDelete(courseId);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getEnrolledCourses = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  // Find courses where students array includes this user
  const courses = await Course.find({ students: userId }).populate({
    path: "instructor",
    select: "name email avatar",
  });

  res.status(200).json({
    status: "success",
    results: courses.length,
    data: {
      courses,
    },
  });
});
exports.getCourseMetrics = catchAsync(async (req, res) => {
  const metrics = await Course.aggregate([
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        totalRevenue: { $sum: "$price" },
        totalStudents: {
          $sum: {
            $size: { $ifNull: ["$students", []] },
          },
        },
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
  res.status(200).json({
    status: "success",
    message: "Enrollment successful",
  });
  next(); // Proceed to payment processing
});
