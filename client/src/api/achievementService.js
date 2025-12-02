import api from "./axios";

export const achievementService = {
  // Get all achievements
  getAllAchievements: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active);

    const response = await api.get(`/achievements?${params.toString()}`);
    return response.data;
  },

  // Get achievement by ID
  getAchievementById: async (id) => {
    const response = await api.get(`/achievements/${id}`);
    return response.data;
  },
};
