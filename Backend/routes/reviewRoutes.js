const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router();

// Routes for creating and getting course-specific reviews
router.delete("/:reviewId",
authController.protect,
reviewController.deleteReview);
router
  .route("/:courseId/reviews")
  .get(reviewController.getCourseReviews)
.post(
authController.protect,
reviewController.createReview);

// New route for getting all reviews with pagination
router.route("/").get(reviewController.getAllReviews);

module.exports = router;
