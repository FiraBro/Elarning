const express = require("express");
const { createCourse, getCourses } = require("../controllers/courseController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCourse);
router.get("/", getCourses);

module.exports = router;
