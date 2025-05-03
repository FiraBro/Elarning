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
  const banner = req.files?.["banner"] ? req.files["banner"][0].filename : null;
  const lessonVideos = req.files?.["lessonVideos"] || [];

  if (!title || !description || !price || lessonVideos.length === 0) {
    return next(
      new AppError(
        "Title, description, price, and at least one lesson video are required",
        400
      )
    );
  }

  const lessons = lessonVideos.map((file, index) => ({
    title: req.body.lessonTitles?.[index] || `Lesson ${index + 1}`,
    videoUrl: file.path.replace(/\\/g, "/"),
  }));

  const course = await Course.create({
    title,
    description,
    shortDescription: description.substring(0, 160),
    price,
    banner,
    instructor: req.user.id,
    category: category || "Other",
    level: level || "Beginner",
    requirements: req.body.requirements || [],
    learningOutcomes: req.body.learningOutcomes || [],
    tags: req.body.tags || [],
    lessons, // ✅ Now storing lesson videos properly
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
exports.getAllCourses = catchAsync(async (req, res, next) => {
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

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new AppError("No course is found with this ID"));
  }
  res.status(200).json({
    status: "succes",
    data: {
      course,
    },
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const { title, description, price, category, level } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  course.title = title || course.title;
  course.description = description || course.description;
  course.price = price || course.price;
  course.category = category || course.category;
  course.level = level || course.level;

  // Handle uploaded files
  if (req.files?.banner) {
    const bannerPath = req.files.banner[0].path;
    course.banner = bannerPath.replace(/\\/g, "/");
  }

  // Update lessons if new ones uploaded
  const lessonVideos = req.files?.["lessonVideos"] || [];
  if (lessonVideos.length > 0) {
    const newLessons = lessonVideos.map((file, index) => ({
      title: req.body.lessonTitles?.[index] || `Lesson ${index + 1}`,
      videoUrl: file.path.replace(/\\/g, "/"),
    }));

    course.lessons = newLessons; // ❗ You could also choose to push instead of replacing
  }

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

exports.getCourseLessons = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const course = await Course.findById(courseId)
    .select(
      "title description shortDescription lessons banner instructor students"
    )
    .populate("instructor", "name");

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (!course.students.some((studentId) => studentId.equals(userId))) {
    return next(new AppError("You are not enrolled in this course", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      course: {
        title: course.title,
        description: course.description,
        shortDescription: course.shortDescription,
        lessons: course.lessons,
        banner: course.banner,
        instructor: course.instructor,
      },
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
