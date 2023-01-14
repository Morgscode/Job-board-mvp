import { createSlice } from '@reduxjs/toolkit';

export const jobApplicationStatusSlice = createSlice({
  name: 'jobApplicationStatuses',
  initialState: {
    data: [],
    page: 1,
    firstRow: 0,
    sortOrder: 'asc',
    totalRecords: 0,
  },
  reducers: {
    setStatuses: (state, action) => {
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
  setFirstRow,
  setTotalRecords,
  setSortOrder,
  updateStatus,
  deleteStatus,
} = jobApplicationStatusSlice.actions;

export default jobApplicationStatusSlice.reducer;
