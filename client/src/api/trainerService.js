import api from "./axios";

export const trainerService = {
  // Get all trainers
  getAllTrainers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active);

    const response = await api.get(`/trainers?${params.toString()}`);
    return response.data;
  },

  // Get trainer by ID
  getTrainerById: async (id) => {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  },
};
