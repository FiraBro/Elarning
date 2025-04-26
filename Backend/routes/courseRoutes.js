const express = require("express");
// const { createCourse, getCourses } = require("../controllers/courseController");
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authController = require('../controllers/authController')

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  courseController.createCourse
);
router.get("/", courseController.getCourses);
router.get("/metrics", courseController.getCourseMetrics);
router.post(
  "/:courseId/enroll",
  authController.protect,
  courseController.trackEnrollment,
//   paymentController.handlePayment
);

module.exports = router;
