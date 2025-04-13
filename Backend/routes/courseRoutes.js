const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createCourse);
router.get('/', getCourses);

module.exports = router;