import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Creates a standardized async thunk for API calls
 * @param {string} type - The action type
 * @param {Function} apiCall - The API call function
 * @param {string} errorMessage - Default error message
 * @param {Function} transformResponse - Optional function to transform the response
 * @returns {AsyncThunk}
 */
export const createApiThunk = (
  type,
  apiCall,
  errorMessage = "Failed",
  transformResponse = null
) =>
  createAsyncThunk(type, async (data, { rejectWithValue }) => {
    try {
      const response = await apiCall(data);
      // If there's a transformResponse, pass the full response to it
      // (response is already the data object from the API, not axios response)
      // Otherwise, extract response.data or response
      if (transformResponse) {
        return transformResponse(response, data);
      }
      const result = response.data || response;
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || errorMessage);
    }
  });
