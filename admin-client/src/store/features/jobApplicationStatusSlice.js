import { createSlice } from '@reduxjs/toolkit';

export const jobApplicationStatusSlice = createSlice({
  name: 'jobApplicationStatuses',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setStatuses: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    updateStatus: (state, action) => {
      state.data = state.data.map((application) =>
        application.id === action.payload.id ? action.payload : application
      );
    },
    deleteStatus: (state, action) => {
      state.data = state.data.filter(
        (application) => application.id !== action.payload
      );
    },
  },
});

export const {
  setStatuses,
  setPage,
  setSortOrder,
  updateStatus,
  deleteStatus,
} = jobApplicationStatusSlice.actions;

export default jobApplicationStatusSlice.reducer;
