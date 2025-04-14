const Course = require("../models/Course");

const createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const course = new Course({
      title,
      description,
      price,
      instructor: req.user.id,
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({status:'success', message: "Server error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.json({ status: "success", length: courses.length, courses });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createCourse, getCourses };
