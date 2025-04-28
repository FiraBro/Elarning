const express = require("express");
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authController = require("../controllers/authController");
const upload = require("../middlewares/multer");

const router = express.Router();

// Update Course Route
router.patch(
  "/:id",
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "lessonVideos", maxCount: 20 },
  ]),
  courseController.updateCourse
);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "lessonVideos", maxCount: 20 },
  ]),
  async (req, res, next) => {
    try {
      await courseController.createCourse(req, res, next);
    } catch (error) {
      console.error("Error in POST /api/courses:", error); // Log error for debugging
      next(error); // Pass error to error handler
    }
  }
);

router.get("/", courseController.getCourses);
router.get(
  "/:courseId/lessons",
  authController.protect,
  courseController.getCourseLessons
);
router.get(
  "/enrolled",
  authController.protect,
  courseController.getEnrolledCourses
);

router.get("/metrics", courseController.getCourseMetrics);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  courseController.deleteCourse
);

router.post(
  "/:courseId/enroll",
  authController.protect,
  courseController.trackEnrollment
);

module.exports = router;
