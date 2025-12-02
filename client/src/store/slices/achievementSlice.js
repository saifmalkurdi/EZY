import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { achievementService } from "../../api/achievementService";

// Async thunks
export const fetchAchievements = createAsyncThunk(
  "achievements/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await achievementService.getAllAchievements(filters);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch achievements"
      );
    }
  }
);

const achievementSlice = createSlice({
  name: "achievements",
  initialState: {
    achievements: [],
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
      // Fetch all achievements
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = achievementSlice.actions;
export default achievementSlice.reducer;
