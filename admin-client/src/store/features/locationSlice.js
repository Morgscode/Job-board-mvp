import { createSlice } from '@reduxjs/toolkit';

export const locationSlice = createSlice({
  name: 'locations',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setLocations: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    deleteLocation: (state, action) => {
      state.data = state.data.filter(job => job.id !== action.payload);
    }
  },
});

export const { setLocations, setPage, setSortOrder, deleteLocation } = locationSlice.actions;

export default locationSlice.reducer;
