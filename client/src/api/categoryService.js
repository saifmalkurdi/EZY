import api from "./axios";

export const categoryService = {
  // Get all categories
  getAllCategories: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active);

    const response = await api.get(`/categories?${params.toString()}`);
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};
