import axios from "./axios";

const purchaseService = {
  // Purchase a plan
  purchasePlan: async (planId) => {
    const response = await axios.post("/purchases/plan", { plan_id: planId });
    return response.data;
  },

  // Purchase a course
  purchaseCourse: async (courseId) => {
    const response = await axios.post("/purchases/course", {
      course_id: courseId,
    });
    return response.data;
  },

  // Get my purchased plans (approved only)
  getMyPlans: async () => {
    const response = await axios.get("/purchases/my/plans");
    return response.data;
  },

  // Get my purchased courses (approved only)
  getMyCourses: async () => {
    const response = await axios.get("/purchases/my/courses");
    return response.data;
  },

  // Get my pending plan requests
  getMyPendingPlans: async () => {
    const response = await axios.get("/purchases/my/pending/plans");
    return response.data;
  },

  // Get my pending course requests
  getMyPendingCourses: async () => {
    const response = await axios.get("/purchases/my/pending/courses");
    return response.data;
  },

  // Get pending course purchases (Teacher/Admin)
  getPendingCoursePurchases: async () => {
    const response = await axios.get("/purchases/pending/courses");
    return response.data;
  },

  // Get pending plan purchases (Admin)
  getPendingPlanPurchases: async () => {
    const response = await axios.get("/purchases/pending/plans");
    return response.data;
  },

  // Approve course purchase (Teacher/Admin)
  approveCoursePurchase: async (purchaseId) => {
    const response = await axios.put(`/purchases/course/${purchaseId}/approve`);
    return response.data;
  },

  // Reject course purchase (Teacher/Admin)
  rejectCoursePurchase: async (purchaseId) => {
    const response = await axios.put(`/purchases/course/${purchaseId}/reject`);
    return response.data;
  },

  // Approve plan purchase (Admin)
  approvePlanPurchase: async (purchaseId) => {
    const response = await axios.put(`/purchases/plan/${purchaseId}/approve`);
    return response.data;
  },

  // Reject plan purchase (Admin)
  rejectPlanPurchase: async (purchaseId) => {
    const response = await axios.put(`/purchases/plan/${purchaseId}/reject`);
    return response.data;
  },
};

export default purchaseService;
