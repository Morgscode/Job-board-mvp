import { createSlice } from '@reduxjs/toolkit';

export const jobApplicationSlice = createSlice({
  name: 'jobApplications',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setApplications: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    updateApplication: (state, action) => {
      state.data = state.data.map((application) =>
        application.id === action.payload.id ? action.payload : application
      );
    },
    deleteApplication: (state, action) => {
      state.data = state.data.filter(
        (application) => application.id !== action.payload
      );
    },
  },
});

export const {
  setApplications,
  setPage,
  setSortOrder,
  updateApplication,
  deleteApplication,
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;
