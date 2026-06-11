import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    cargaInicialCategories: (state, action) => {
      return action.payload;
    },
    agregarCategoryRedux: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { cargaInicialCategories, agregarCategoryRedux } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;