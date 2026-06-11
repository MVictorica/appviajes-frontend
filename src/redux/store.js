import { configureStore } from "@reduxjs/toolkit";
import tripsSlice from "./features/tripsSlice.js";
import categoriesSlice from "./features/categoriesSlice.js";
import loadingSlice from "./features/loadingSlice.js";

export const store = configureStore({
  reducer: {
    tripsSlice,
    categoriesSlice,
    loadingSlice,
  },
});