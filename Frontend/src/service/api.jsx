import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const courseService = {
  getAllCourses: async (params = {}) => {
    try {
      const response = await API.get("/courses", { params });
      return response.data; // { data: { courses }, total, results }
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  getCourseById: async (id) => {
    try {
      const response = await API.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw error;
    }
  },

  getMetrics: async () => {
    try {
      const response = await API.get("/courses/metrics");
      return response.data.data; // { totalCourses, totalRevenue, totalStudents }
    } catch (error) {
      console.error("Error fetching course metrics:", error);
      throw error;
    }
  },

  createCourse: async (courseData, setUploadProgress) => {
    try {
      const response = await API.post("/courses", courseData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          if (setUploadProgress && typeof setUploadProgress === "function") {
            setUploadProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  // Fixed deleteCourse to use API instance and correct endpoint
  deleteCourse: async (courseId) => {
    try {
      const response = await API.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting course ${courseId}:`, error);
      throw error;
    }
  },

  // Fixed updateCourse to use API instance and correct endpoint
  updateCourse: async (courseId, formData) => {
    try {
      const response = await API.patch(`/courses/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // for file uploads
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating course ${courseId}:`, error);
      throw error;
    }
  },
  enrollInCourse: async (courseId) => {
    try {
      const response = await API.post(`/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      console.error(`Error enrolling in course ${courseId}:`, error);
      throw error;
    }
  },

  getEnrolledCourses: async () => {
    try {
      const response = await API.get("/courses/enrolled");
      console.log(response.data.data.courses);
      return response.data.data.courses; // returns array of enrolled courses
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw error;
    }
  },
  getCourseLessons: async (courseId) => {
    const response = API.get(`/courses/${courseId}/lessons`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    console.log(response)
    return response
  },
};

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await API.get("/users");
      console.log(response);
      return response.data.data.users; // Match the { data: { users } } structure
    } catch (error) {
      console.error(
        "User fetch error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await API.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const response = await API.get("/users/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  updateUser: async (updateData) => {
    try {
      const formData = new FormData();
      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.email) formData.append("email", updateData.email);
      if (updateData.photo) formData.append("photo", updateData.photo);

      const response = await API.patch("/users/updateMe", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.data.user.role);
      localStorage.setItem("userId", response.data.data.user._id);
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      const response = await API.post("/auth/register", userData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.data.user.role);
      localStorage.setItem("userId", response.data.data.user._id);
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error.response?.data);
      throw error;
    }
  },

  deleteMe: async () => {
    try {
      const response = await API.delete("/users/deleteMe");
      return response.data;
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await API.delete(`/users/${userId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  },
};
