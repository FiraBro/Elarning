import React, { useEffect, useState } from "react";
import { courseService } from "../service/api";
import styles from "./CourseList.module.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "",
    video: null,
    banner: null,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      alert("Error deleting course: " + err.message);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price,
      category: course.category,
      level: course.level,
      video: null,
      banner: null,
    });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== null && val !== "") updateData.append(key, val);
    });

    try {
      const res = await courseService.updateCourse(editingCourse, updateData);
      // Update course in state
      setCourses((prev) =>
        prev.map((course) =>
          course._id === editingCourse ? res.data.course : course
        )
      );
      setEditingCourse(null);
    } catch (err) {
      alert("Error updating course: " + err.message);
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>Courses</h2>
      {courses.length === 0 && <p>No courses available.</p>}

      {courses.map((course) => (
        <div key={course._id} className={styles.courseCard}>
          {editingCourse === course._id ? (
            <form onSubmit={handleUpdate} className={styles.editForm}>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
              />
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Category"
              />
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                placeholder="Level"
              />
              <label>
                Video:
                <input
                  type="file"
                  name="video"
                  accept="video/*"
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Banner:
                <input
                  type="file"
                  name="banner"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditingCourse(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              <p>Category: {course.category}</p>
              <p>Level: {course.level}</p>
              <button onClick={() => handleEditClick(course)}>Edit</button>
              <button onClick={() => handleDelete(course._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseList;
