import { createSlice } from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    data: [],
    page: 1,
    firstRow: 0,
    sortOrder: 'asc',
    totalRecords: 0,
  },
  reducers: {
    setLocations: (state, action) => {
      state.data = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload
    },
    setFirstRow: (state, action) => {
      state.firstRow = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    addLocation: (state, action) => {
      const locations = [...state.data];
      state.data = [...locations, action.payload];
    },
    updateLocation: (state, action) => {
      state.data = state.data.map((location) =>
        location.id === action.payload.id ? action.payload : location
      );
    },
    deleteLocation: (state, action) => {
      state.data = state.data.filter(
        (location) => location.id !== action.payload
      );
    },
  },
});

export const {
  setLocations,
  setPage,
  setFirstRow,
  setTotalRecords,
  setSortOrder,
  addLocation,
  updateLocation,
  deleteLocation,
} = locationSlice.actions;

export default locationSlice.reducer;
