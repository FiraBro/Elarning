const express = require("express");
// const { createCourse, getCourses } = require("../controllers/courseController");
const courseController = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const authController = require("../controllers/authController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Specify the upload directory

const router = express.Router();
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
router.get("/metrics", courseController.getCourseMetrics);
router.post(
  "/:courseId/enroll",
  authController.protect,
  courseController.trackEnrollment
  //   paymentController.handlePayment
);

module.exports = router;
