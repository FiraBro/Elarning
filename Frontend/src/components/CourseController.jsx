import React, { useState, useEffect } from "react";
import style from "./CourseController.module.css";
import { courseService } from "../service/api";

const CourseController = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "Beginner",
    lessonVideos: [], // Array of { file, preview, title }
    banner: null,
    bannerPreview: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingCourseId, setEditingCourseId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getAllCourses();
      setCourses(data.courses);
    } catch (err) {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle video title change
  const handleVideoTitleChange = (index, value) => {
    setFormData((prev) => {
      const updatedVideos = [...prev.lessonVideos];
      updatedVideos[index] = { ...updatedVideos[index], title: value };
      return { ...prev, lessonVideos: updatedVideos };
    });
  };

  // Handle multiple video files selection
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "lessonVideos") {
      const fileArray = Array.from(files);
      const newVideos = fileArray.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: "",
      }));
      setFormData((prev) => ({
        ...prev,
        lessonVideos: newVideos,
      }));
    }
    if (name === "banner" && files[0]) {
      setFormData((prev) => ({
        ...prev,
        banner: files[0],
        bannerPreview: URL.createObjectURL(files[0]),
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      level: "Beginner",
      lessonVideos: [],
      banner: null,
      bannerPreview: "",
    });
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) < 0
    ) {
      setError("A valid price is required.");
      return;
    }
    if (formData.lessonVideos.length === 0) {
      setError("At least one lesson video is required.");
      return;
    }
    if (formData.lessonVideos.some((video) => !video.title.trim())) {
      setError("All videos must have a title.");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("level", formData.level);

    if (formData.banner) {
      form.append("banner", formData.banner);
    }

    formData.lessonVideos.forEach((video, index) => {
      form.append("lessonVideos", video.file); // Use "lessonVideos" instead of "lessonVideos[]"
      form.append(`lessonTitles[${index}]`, video.title);
    });

    // Debug FormData
    for (let [key, value] of form.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      if (editingCourseId) {
        await courseService.updateCourse(editingCourseId, form);
      } else {
        await courseService.createCourse(form, setUploadProgress);
      }
      const { data } = await courseService.getAllCourses();
      setCourses(data.courses);
      resetForm();
      setEditingCourseId(null);
    } catch (err) {
      setError(err.message || "Operation failed.");
      setUploadProgress(0);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseService.deleteCourse(courseId);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      setError(err.message || "Failed to delete course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      title: course.title || "",
      description: course.description || "",
      price: course.price || "",
      category: course.category || "",
      level: course.level || "Beginner",
      lessonVideos: [],
      banner: null,
      bannerPreview: course.bannerUrl || "",
    });
    document.getElementById("addForm")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={style.course}>
      <div className={style.coursebg}>
        <div className={style.headCourseOne}>
          <h2>Course Management</h2>
          <button
            className={style.addButton}
            onClick={() => {
              resetForm();
              setEditingCourseId(null);
              document
                .getElementById("addForm")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Add New Course
          </button>
        </div>

        {error && <div className={style.error}>{error}</div>}

        {loading ? (
          <div className={style.loading}>Loading courses...</div>
        ) : (
          <div className={style.courseList}>
            <div className={style.gridHeader}>
              <span>Title</span>
              <span className={style.mobileHidden}>Category</span>
              <span>Level</span>
              <span>Price</span>
              <span>Actions</span>
            </div>
            {courses.map((course) => (
              <div key={course._id} className={style.courseItem}>
                <div className={style.courseTitle}>{course.title}</div>
                <div className={style.mobileHidden}>{course.category}</div>
                <div>{course.level}</div>
                <div className={style.mobileHidden}>
                  ${course.price?.toFixed(2)}
                </div>
                <div className={style.actions}>
                  <button
                    className={style.editBtn}
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="addForm" className={style.coursebg}>
        <h3>
          {editingCourseId ? `Edit "${formData.title}"` : "Add New Course"}
        </h3>
        <form onSubmit={handleSubmit} className={style.form}>
          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Title*</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label>Price ($)*</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Category*</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label>Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className={style.formGroup}>
            <label>Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
            />
          </div>

          <div className={style.formGroup}>
            <label>Course Videos* (Select multiple)</label>
            <input
              type="file"
              name="lessonVideos"
              multiple
              accept="video/*"
              onChange={handleFileChange}
              required={!editingCourseId && formData.lessonVideos.length === 0}
            />
          </div>

          {formData.lessonVideos.length > 0 && (
            <div className={style.videoList}>
              {formData.lessonVideos.map((video, idx) => (
                <div key={idx} className={style.videoWithTitle}>
                  <label>Video {idx + 1} Title*</label>
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) =>
                      handleVideoTitleChange(idx, e.target.value)
                    }
                    placeholder={`Video ${idx + 1} title`}
                    required
                  />
                  <video width="100%" controls className={style.videoPreview}>
                    <source src={video.preview} />
                  </video>
                </div>
              ))}
            </div>
          )}

          <div className={style.formGroup}>
            <label>Banner Image</label>
            <input
              type="file"
              name="banner"
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.bannerPreview && (
              <img
                src={formData.bannerPreview}
                alt="Banner preview"
                className={style.imagePreview}
              />
            )}
          </div>

          {uploadProgress > 0 && (
            <div className={style.progressBar}>
              <div
                className={style.progressFill}
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <button
            type="submit"
            className={style.submitButton}
            disabled={uploadProgress > 0 && uploadProgress < 100}
          >
            {uploadProgress > 0
              ? "Uploading..."
              : editingCourseId
              ? "Update Course"
              : "Create Course"}
          </button>
          {editingCourseId && (
            <button
              type="button"
              className={style.cancelButton}
              onClick={() => {
                resetForm();
                setEditingCourseId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CourseController;
