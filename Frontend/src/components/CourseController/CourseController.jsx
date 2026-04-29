import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Video,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import style from "./CourseController.module.css";
import { courseService } from "../../service/api";

const CourseController = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingCourseId, setEditingCourseId] = useState(null);

  const initialFormState = {
    title: "",
    description: "",
    price: "",
    category: "",
    level: "Beginner",
    lessonVideos: [],
    banner: null,
    bannerPreview: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- MEMORY CLEANUP ---
  useEffect(() => {
    return () => {
      formData.lessonVideos.forEach((v) => URL.revokeObjectURL(v.preview));
      if (formData.bannerPreview) URL.revokeObjectURL(formData.bannerPreview);
    };
  }, [formData.lessonVideos, formData.bannerPreview]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data.data?.courses || []);
    } catch (err) {
      setError("Failed to synchronize with server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;

    if (name === "lessonVideos") {
      const newVideos = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""), // Auto-fill title with filename
      }));
      setFormData((p) => ({
        ...p,
        lessonVideos: [...p.lessonVideos, ...newVideos],
      }));
    }

    if (name === "banner") {
      setFormData((p) => ({
        ...p,
        banner: files[0],
        bannerPreview: URL.createObjectURL(files[0]),
      }));
    }
  };

  const removeVideo = (index) => {
    setFormData((p) => {
      const filtered = p.lessonVideos.filter((_, i) => i !== index);
      URL.revokeObjectURL(p.lessonVideos[index].preview);
      return { ...p, lessonVideos: filtered };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (!["lessonVideos", "banner", "bannerPreview"].includes(key)) {
        form.append(key, formData[key]);
      }
    });

    if (formData.banner) form.append("banner", formData.banner);

    formData.lessonVideos.forEach((video, index) => {
      form.append("lessonVideos", video.file);
      form.append(`lessonTitles[${index}]`, video.title);
    });

    try {
      if (editingCourseId) {
        await courseService.updateCourse(editingCourseId, form);
      } else {
        await courseService.createCourse(form, setUploadProgress);
      }
      await fetchCourses();
      setFormData(initialFormState);
      setEditingCourseId(null);
      setUploadProgress(0);
    } catch (err) {
      setError(err.message || "Failed to save course.");
      setUploadProgress(0);
    }
  };

  return (
    <div className={style.container}>
      {/* HEADER SECTION */}
      <header className={style.dashboardHeader}>
        <div>
          <h1>Course Management</h1>
          <p>Create, update, and manage your educational content</p>
        </div>
        <button
          className={style.btnPrimary}
          onClick={() => {
            setEditingCourseId(null);
            setFormData(initialFormState);
          }}
        >
          <Plus size={18} /> New Course
        </button>
      </header>

      <div className={style.layoutGrid}>
        {/* LIST SECTION */}
        <section className={style.card}>
          <h3>Active Courses</h3>
          {loading ? (
            <div className={style.loader}>
              <Loader2 className={style.spin} /> Loading...
            </div>
          ) : (
            <div className={style.tableWrapper}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Course</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        <div className={style.courseTitleCell}>
                          <strong>{course.title}</strong>
                          <span>{course.level}</span>
                        </div>
                      </td>
                      <td>
                        <span className={style.badge}>{course.category}</span>
                      </td>
                      <td>${course.price}</td>
                      <td>
                        <div className={style.tableActions}>
                          <button
                            onClick={() => setEditingCourseId(course._id)}
                            className={style.iconBtn}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className={`${style.iconBtn} ${style.delete}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FORM SECTION */}
        <section className={style.card}>
          <h3>{editingCourseId ? "Edit Course" : "Course Details"}</h3>
          <form onSubmit={handleSubmit} className={style.mainForm}>
            <div className={style.inputGroup}>
              <label>Title</label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Master React in 30 Days"
                required
              />
            </div>

            <div className={style.row}>
              <div className={style.inputGroup}>
                <label>Price ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className={style.inputGroup}>
                <label>Level</label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className={style.inputGroup}>
              <label>Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* VIDEO UPLOAD ZONE */}
            <div className={style.uploadZone}>
              <label className={style.fileLabel}>
                <Video size={20} />
                <span>Upload Lesson Videos</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileChange}
                  hidden
                />
              </label>

              <div className={style.previewList}>
                {formData.lessonVideos.map((video, idx) => (
                  <div key={idx} className={style.videoItem}>
                    <input
                      value={video.title}
                      onChange={(e) => {
                        const newVids = [...formData.lessonVideos];
                        newVids[idx].title = e.target.value;
                        setFormData({ ...formData, lessonVideos: newVids });
                      }}
                    />
                    <button type="button" onClick={() => removeVideo(idx)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className={style.progressContainer}>
                <div className={style.progressTrack}>
                  <div
                    className={style.progressBar}
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span>Uploading {uploadProgress}%</span>
              </div>
            )}

            <button
              type="submit"
              className={style.btnSubmit}
              disabled={uploadProgress > 0}
            >
              {editingCourseId ? "Update Course" : "Publish Course"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default CourseController;
