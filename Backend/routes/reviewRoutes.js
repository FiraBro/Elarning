const express = require("express");
const reviewController = require("../controllers/reviewController");
const { protect } = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(reviewController.getCourseReviews)
  .post(protect, reviewController.createReview);

module.exports = router;
