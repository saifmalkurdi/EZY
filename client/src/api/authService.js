import api from "./axios";

export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete("/auth/delete");
    return response.data;
  },

  // Create teacher (Admin only)
  createTeacher: async (teacherData) => {
    const response = await api.post("/auth/teachers", teacherData);
    return response.data;
  },
};
