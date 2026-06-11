import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const tripsSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    cargaInicialTrips: (state, action) => {
      return action.payload;
    },
    agregarTripRedux: (state, action) => {
      state.push(action.payload);
    },
    editarTripRedux: (state, action) => {
      const trip = action.payload;
      const index = state.findIndex((t) => t._id === trip._id);
      if (index !== -1) {
        state[index] = trip;
      }
    },
    eliminarTripRedux: (state, action) => {
      const id = action.payload;
      const index = state.findIndex((t) => t._id === id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const {
  cargaInicialTrips,
  agregarTripRedux,
  editarTripRedux,
  eliminarTripRedux,
} = tripsSlice.actions;
export default tripsSlice.reducer;