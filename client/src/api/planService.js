import api from "./axios";

export const planService = {
  // Get all plans
  getAllPlans: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active);
    if (filters.limit !== undefined) params.append("limit", filters.limit);
    if (filters.offset !== undefined) params.append("offset", filters.offset);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get(`/plans?${params.toString()}`);
    return response.data;
  },

  // Get plan by ID
  getPlanById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  },

  // Create a plan (Admin only)
  createPlan: async (planData) => {
    const response = await api.post("/plans", planData);
    return response.data;
  },

  // Update a plan
  updatePlan: async (id, planData) => {
    const response = await api.put(`/plans/${id}`, planData);
    return response.data;
  },

  // Toggle plan active/inactive status (Admin only)
  togglePlanStatus: async (id) => {
    const response = await api.patch(`/plans/${id}/toggle-status`);
    return response.data;
  },

  // Delete a plan
  deletePlan: async (id) => {
    await api.delete(`/plans/${id}`);
  },
};
