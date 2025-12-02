import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { trainerService } from "../../api/trainerService";

// Async thunks
export const fetchTrainers = createAsyncThunk(
  "trainers/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await trainerService.getAllTrainers(filters);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trainers"
      );
    }
  }
);

export const fetchTrainerById = createAsyncThunk(
  "trainers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await trainerService.getTrainerById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trainer"
      );
    }
  }
);

const trainerSlice = createSlice({
  name: "trainers",
  initialState: {
    trainers: [],
    selectedTrainer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTrainer: (state) => {
      state.selectedTrainer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all trainers
      .addCase(fetchTrainers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainers.fulfilled, (state, action) => {
        state.loading = false;
        state.trainers = action.payload;
      })
      .addCase(fetchTrainers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch trainer by ID
      .addCase(fetchTrainerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainerById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrainer = action.payload;
      })
      .addCase(fetchTrainerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedTrainer } = trainerSlice.actions;
export default trainerSlice.reducer;
