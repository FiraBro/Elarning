import axios from "axios";

const IMAGE_BASE_URL =
import.meta.env.VITE_APP_IMAGE_URL || "http://localhost:5000";
// Use environment variables for URLs
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Add request interceptor for auth headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized error handler
function handleError(error) {
  // Optionally show a toast/notification here
  const message =
    error.response?.data?.message ||
    error.message ||
    "An unexpected error occurred";
  // Optionally log to an external service
  return Promise.reject(new Error(message));
}

export const courseService = {
  getAllCourses: async (params = {}) => {
    try {
      const { data } = await API.get("/courses", { params });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getCourseById: async (id) => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getMetrics: async () => {
    try {
      const { data } = await API.get("/courses/metrics");
      return data.data;
    } catch (error) {
      return handleError(error);
    }
  },

  createCourse: async (courseData, setUploadProgress) => {
    try {
      const { data } = await API.post("/courses", courseData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (setUploadProgress && typeof setUploadProgress === "function") {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          }
        },
      });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const { data } = await API.delete(`/courses/${courseId}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateCourse: async (courseId, formData) => {
    try {
      const { data } = await API.patch(`/courses/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  enrollInCourse: async (courseId) => {
    try {
      const { data } = await API.post(`/courses/${courseId}/enroll`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getEnrolledCourses: async () => {
    try {
      const { data } = await API.get("/courses/enrolled");
      return data.data.courses;
    } catch (error) {
      return handleError(error);
    }
  },

  getCourseLessons: async (courseId) => {
    try {
      const { data } = await API.get(`/courses/${courseId}/lessons`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getBannerUrl: (banner) => {
    if (!banner) return "/default-course.jpg";
    if (banner.startsWith("uploads/")) {
      return `${IMAGE_BASE_URL}/${banner}`;
    }
    return `${IMAGE_BASE_URL}/uploads/banners/${banner}`;
  },
};

export const userService = {
  getAllUsers: async () => {
    try {
      const { data } = await API.get("/users");
      return data.data.users;
    } catch (error) {
      return handleError(error);
    }
  },

  getUserById: async (id) => {
    try {
      const { data } = await API.get(`/users/${id}`);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  getMe: async () => {
    try {
      const { data } = await API.get("/users/me");
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  updateUser: async (updateData) => {
    try {
      const formData = new FormData();
      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.email) formData.append("email", updateData.email);
      if (updateData.photo) formData.append("photo", updateData.photo);

      const { data } = await API.patch("/users/updateMe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  login: async (credentials) => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.data.user.role);
      localStorage.setItem("userId", data.data.user._id);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  signup: async (userData) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.data.user.role);
      localStorage.setItem("userId", data.data.user._id);
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteMe: async () => {
    try {
      const { data } = await API.delete("/users/deleteMe");
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  deleteUser: async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      return true;
    } catch (error) {
      return handleError(error);
    }
  },

  getUserImageUrl: (photo) => {
    if (!photo) return "/default-avatar.jpg";
    let url = `${IMAGE_BASE_URL}/uploads/userImage/${photo}`;
    if (photo.startsWith("uploads/")) {
      url = `${IMAGE_BASE_URL}/${photo}`;
    }
    return `${url}?${Date.now()}`; // Cache-busting
  },

  forgotPassword: async (email) => {
    try {
      const { data } = await API.post("/auth/forgot-password", { email });
      return data.message;
    } catch (error) {
      return handleError(error);
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    try {
      const { data } = await API.patch(`/auth/reset-password/${token}`, {
        password: newPassword,
        passwordConfirm: confirmPassword,
      });
      if (data.token && data.data && data.data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.data.user.role);
        localStorage.setItem("userId", data.data.user._id);
      }
      return data;
    } catch (error) {
      return handleError(error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  },
};
