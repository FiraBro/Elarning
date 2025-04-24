// // services/api.js
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add request interceptor for auth headers if needed
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const courseService = {
//   getAllCourses: async (params = {}) => {
//     try {
//       // Pass params as query string parameters
//       const response = await API.get("/courses", { params });
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//       throw error;
//     }
//   },

//   getCourseById: async (id) => {
//     try {
//       const response = await API.get(`/courses/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching course ${id}:`, error);
//       throw error;
//     }
//   },
// };

// export const userService = {
//   getAllUsers: async () => {
//     try {
//       const response = await API.get("/users");
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching users:", error);
//       throw error;
//     }
//   },

//   getUserById: async (id) => {
//     try {
//       const response = await API.get(`/users/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error(`Error fetching user ${id}:`, error);
//       throw error;
//     }
//   },

//   login: async (credentials) => {
//     try {
//       const response = await API.post("/auth/login", credentials);
//       // Store the token upon successful login
//       localStorage.setItem("token", response.data.token);
//       return response.data;
//     } catch (error) {
//       console.error("Login failed:", error);
//       throw error;
//     }
//   },

//   signup: async (userData) => {
//     try {
//       const response = await API.post("/auth/register", userData);
//       // Optionally, store the token after signup
//       localStorage.setItem("token", response.data.token);
//       return response.data;
//     } catch (error) {
//       console.error("Signup error details:", {
//         status: error.response?.status,
//         data: error.response?.data,
//         headers: error.response?.headers,
//       });
//       throw error;
//     }
//   },
// };

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
      return response.data;
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
};

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await API.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
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

  login: async (credentials) => {
    try {
      const response = await API.post("/auth/login", credentials);
      console.log(response);
      // Store token and user data
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
      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", response.data.data.user.role);
      localStorage.setItem("userId", response.data.data.user._id);
      return response.data;
    } catch (error) {
      console.error("Signup failed:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
  },
};
