// import React, { useEffect, useState } from "react";
// import style from "./CourseController.module.css";

// const API_URL = "https://your-backend.com/api/courses";

// const CourseController = () => {
//   const [courses, setCourses] = useState([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     price: "",
//     category: "",
//     level: "Beginner",
//     video: "",
//     banner: "",
//     instructor: "", // This should be populated from your auth context or user selection
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const res = await fetch(API_URL);
//         const data = await res.json();
//         setCourses(data);
//       } catch (err) {
//         setError("Failed to load courses");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           price: Number(formData.price),
//           instructor: "65d4a5e1c1b9a9b9b9b9b9b9", // Replace with actual instructor ID
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to add course");

//       const newCourse = await res.json();
//       setCourses([...courses, newCourse]);
//       setFormData({
//         title: "",
//         description: "",
//         price: "",
//         category: "",
//         level: "Beginner",
//         video: "",
//         banner: "",
//         instructor: "",
//       });
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className={style.course}>
//       <div className={style.coursebg}>
//         <div className={style.headCourseOne}>
//           <h2>Course Management</h2>
//           <button
//             className={style.addButton}
//             onClick={() =>
//               document
//                 .getElementById("addForm")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//           >
//             Add New Course
//           </button>
//         </div>

//         {error && <div className={style.error}>{error}</div>}

//         {loading ? (
//           <div className={style.loading}>Loading courses...</div>
//         ) : (
//           <div className={style.courseList}>
//             <div className={style.headCourseTwo}>
//               <span>Title</span>
//               <span>Category</span>
//               <span>Level</span>
//               <span>Price</span>
//               <span>Actions</span>
//             </div>

//             {courses.map((course) => (
//               <div key={course._id} className={style.courseItem}>
//                 <strong>{course.title}</strong>
//                 <span>{course.category}</span>
//                 <span>{course.level}</span>
//                 <span>${course.price.toFixed(2)}</span>
//                 <div className={style.actions}>
//                   <button>Edit</button>
//                   <button>Delete</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div id="addForm" className={style.coursebg}>
//         <h3>Add New Course</h3>
//         <form onSubmit={handleAdd} className={style.form}>
//           <div className={style.formGroup}>
//             <label>Title</label>
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={style.formGroup}>
//             <label>Description</label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={style.formGroup}>
//             <label>Price ($)</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={style.formGroup}>
//             <label>Category</label>
//             <input
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div className={style.formGroup}>
//             <label>Level</label>
//             <select name="level" value={formData.level} onChange={handleChange}>
//               <option value="Beginner">Beginner</option>
//               <option value="Intermediate">Intermediate</option>
//               <option value="Advanced">Advanced</option>
//             </select>
//           </div>

//           <div className={style.formGroup}>
//             <label>Video URL</label>
//             <input
//               type="url"
//               name="video"
//               value={formData.video}
//               onChange={handleChange}
//             />
//           </div>

//           <div className={style.formGroup}>
//             <label>Banner Image URL</label>
//             <input
//               type="url"
//               name="banner"
//               value={formData.banner}
//               onChange={handleChange}
//             />
//           </div>

//           <button type="submit" className={style.submitButton}>
//             Create Course
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CourseController;


import React, { useEffect, useState } from "react";
import style from "./CourseController.module.css";

const API_URL = "https://your-backend.com/api/courses";

const CourseController = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    level: "Beginner",
    video: null,
    banner: null,
    bannerPreview: "",
    videoPreview: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (name === "video" && file) {
      setFormData(prev => ({
        ...prev,
        video: file,
        videoPreview: URL.createObjectURL(file)
      }));
    }

    if (name === "banner" && file) {
      setFormData(prev => ({
        ...prev,
        banner: file,
        bannerPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value && typeof value !== 'object') form.append(key, value);
      if (value instanceof File) form.append(key, value);
    });

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.open("POST", API_URL, true);
      xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('token')}`);
      
      xhr.onload = () => {
        if (xhr.status === 201) {
          const newCourse = JSON.parse(xhr.response);
          setCourses([...courses, newCourse]);
          setFormData({
            title: "",
            description: "",
            price: "",
            category: "",
            level: "Beginner",
            video: null,
            banner: null,
            bannerPreview: "",
            videoPreview: ""
          });
          setUploadProgress(0);
        } else {
          setError(xhr.responseText || "Upload failed");
        }
      };

      xhr.send(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={style.course}>
      <div className={style.coursebg}>
        <div className={style.headCourseOne}>
          <h2>Course Management</h2>
          <button 
            className={style.addButton}
            onClick={() => document.getElementById('addForm')?.scrollIntoView({ behavior: 'smooth' })}
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
              <span className={style.mobileHidden}>Price</span>
              <span>Actions</span>
            </div>
            
            {courses.map(course => (
              <div key={course._id} className={style.courseItem}>
                <div className={style.courseTitle}>{course.title}</div>
                <div className={style.mobileHidden}>{course.category}</div>
                <div>{course.level}</div>
                <div className={style.mobileHidden}>${course.price?.toFixed(2)}</div>
                <div className={style.actions}>
                  <button className={style.editBtn}>Edit</button>
                  <button className={style.deleteBtn}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div id="addForm" className={style.coursebg}>
        <h3>Add New Course</h3>
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

          <div className={style.formRow}>
            <div className={style.formGroup}>
              <label>Course Video*</label>
              <input
                type="file"
                name="video"
                onChange={handleFileChange}
                accept="video/*"
                required
              />
              {formData.videoPreview && (
                <div className={style.videoPreview}>
                  <video width="100%" controls>
                    <source src={formData.videoPreview} type={formData.video?.type} />
                  </video>
                </div>
              )}
            </div>

            <div className={style.formGroup}>
              <label>Banner Image</label>
              <input
                type="file"
                name="banner"
                onChange={handleFileChange}
                accept="image/*"
              />
              {formData.bannerPreview && (
                <img 
                  src={formData.bannerPreview} 
                  alt="Banner preview"
                  className={style.imagePreview}
                />
              )}
            </div>
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
            {uploadProgress > 0 ? 'Uploading...' : 'Create Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseController;
