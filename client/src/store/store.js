import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import planReducer from "./slices/planSlice";
import trainerReducer from "./slices/trainerSlice";
import achievementReducer from "./slices/achievementSlice";
import categoryReducer from "./slices/categorySlice";
import purchaseReducer from "./slices/purchaseSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token"], // Only persist user and token from auth slice
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    courses: courseReducer,
    plans: planReducer,
    trainers: trainerReducer,
    achievements: achievementReducer,
    categories: categoryReducer,
    purchase: purchaseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
