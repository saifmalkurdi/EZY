import { createSlice } from "@reduxjs/toolkit";
import { createApiThunk } from "../../utils/thunkUtils";
import { courseService } from "../../api/courseService";

// Async thunks
export const fetchCourses = createApiThunk(
  "courses/fetchAll",
  (filters = {}) => courseService.getAllCourses(filters),
  "Failed to fetch courses",
  (result) => result // Return the full result object (data and total)
);

export const fetchCourseById = createApiThunk(
  "courses/fetchById",
  (id) => courseService.getCourseById(id),
  "Failed to fetch course"
);

export const createCourse = createApiThunk(
  "courses/create",
  (courseData) => courseService.createCourse(courseData),
  "Failed to create course"
);

export const updateCourse = createApiThunk(
  "courses/update",
  ({ id, courseData }) => courseService.updateCourse(id, courseData),
  "Failed to update course"
);

export const deleteCourse = createApiThunk(
  "courses/delete",
  (id) => courseService.deleteCourse(id),
  "Failed to delete course",
  (result, id) => id
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    selectedCourse: null,
    total: 0,
    loading: false,
    error: null,
    filters: {
      category: null,
      level: null,
      search: "",
      is_active: true,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        level: null,
        search: "",
        is_active: true,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || action.payload;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch course by ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create course
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses.unshift(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update course
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.courses.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.selectedCourse?.id === action.payload.id) {
          state.selectedCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete course
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = state.courses.filter((c) => c.id !== action.payload);
        if (state.selectedCourse?.id === action.payload) {
          state.selectedCourse = null;
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearSelectedCourse } =
  courseSlice.actions;
export default courseSlice.reducer;
