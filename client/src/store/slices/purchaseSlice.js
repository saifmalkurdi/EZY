import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/thunkUtils";
import purchaseService from "../../api/purchaseService";

// Async thunks
export const purchasePlan = createApiThunk(
  "purchase/purchasePlan",
  (planId) => purchaseService.purchasePlan(planId),
  "Failed to purchase plan"
);

export const purchaseCourse = createApiThunk(
  "purchase/purchaseCourse",
  (courseId) => purchaseService.purchaseCourse(courseId),
  "Failed to purchase course"
);

export const fetchMyPlans = createApiThunk(
  "purchase/fetchMyPlans",
  () => purchaseService.getMyPlans(),
  "Failed to fetch your plans"
);

export const fetchMyCourses = createApiThunk(
  "purchase/fetchMyCourses",
  () => purchaseService.getMyCourses(),
  "Failed to fetch your courses"
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState: {
    myPlans: [],
    myCourses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Purchase Plan
      .addCase(purchasePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchasePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlans.push(action.payload.data);
      })
      .addCase(purchasePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Purchase Course
      .addCase(purchaseCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses.push(action.payload.data);
      })
      .addCase(purchaseCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Plans
      .addCase(fetchMyPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.myPlans = action.payload.data || [];
      })
      .addCase(fetchMyPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Courses
      .addCase(fetchMyCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.myCourses = action.payload.data || [];
      })
      .addCase(fetchMyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
