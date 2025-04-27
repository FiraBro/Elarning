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
    { name: "video", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  courseController.updateCourse
);

// Route definition with multer middleware
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  courseController.createCourse
);

router.get("/", courseController.getCourses);
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
  //   paymentController.handlePayment
);

module.exports = router;
