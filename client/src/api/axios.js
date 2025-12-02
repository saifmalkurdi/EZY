import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    try {
      // First try to get token from persisted Redux state
      const persistedState = localStorage.getItem("persist:root");
      if (persistedState && persistedState !== "undefined") {
        const rootState = JSON.parse(persistedState);
        if (rootState.auth && rootState.auth !== "undefined") {
          const authState = JSON.parse(rootState.auth);
          if (authState.token) {
            config.headers.Authorization = `Bearer ${authState.token}`;
            return config;
          }
        }
      }

      // Fallback: try to get token from direct localStorage
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Silently fail - no token available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Only redirect if not already on login/register pages
      if (currentPath !== "/login" && currentPath !== "/register") {
        // Clear auth from Redux Persist properly
        try {
          const persistedState = localStorage.getItem("persist:root");
          if (persistedState) {
            const rootState = JSON.parse(persistedState);
            rootState.auth = JSON.stringify({
              user: null,
              token: null,
              loading: false,
              error: null
            });
            localStorage.setItem("persist:root", JSON.stringify(rootState));
          }
        } catch (e) {
          // If that fails, clear everything
          localStorage.removeItem("persist:root");
        }
        // Redirect to login
        window.location.href = "/login";
      } else {
        // On login/register pages, just clear the stale token
        try {
          const persistedState = localStorage.getItem("persist:root");
          if (persistedState) {
            const rootState = JSON.parse(persistedState);
            const authState = JSON.parse(rootState.auth);
            // Only clear if there's a stale token
            if (authState.token) {
              rootState.auth = JSON.stringify({
                user: null,
                token: null,
                loading: false,
                error: null
              });
              localStorage.setItem("persist:root", JSON.stringify(rootState));
            }
          }
        } catch (e) {
          // Silently fail
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
