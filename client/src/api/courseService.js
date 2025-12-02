import api from "./axios";

export const courseService = {
  // Get all courses
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active);
    if (filters.category) params.append("category", filters.category);
    if (filters.level) params.append("level", filters.level);
    if (filters.search) params.append("search", filters.search);
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.offset) params.append("offset", filters.offset);

    const response = await api.get(`/courses?${params.toString()}`);
    return response.data; // Already returns {success, data}
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data; // Already returns {success, data}
  },

  // Create a course (Teacher only)
  createCourse: async (courseData) => {
    const response = await api.post("/courses", courseData);
    return response.data; // Already returns {success, data}
  },

  // Update a course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data; // Already returns {success, data}
  },

  // Delete a course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data; // Already returns {success, data}
  },

  // Toggle course active status (Teacher only)
  toggleCourseStatus: async (id, is_active) => {
    const response = await api.patch(`/courses/${id}/toggle-status`, {
      is_active,
    });
    return response.data; // Already returns {success, data}
  },
};
