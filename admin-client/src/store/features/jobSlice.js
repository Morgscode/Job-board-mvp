import { createSlice } from '@reduxjs/toolkit';

export const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setJobs: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    deleteJob: (state, action) => {
      state.data = state.data.filter(job => job.id !== action.payload);
    }
  },
});

export const { setJobs, setPage, setSortOrder, deleteJob } = jobSlice.actions;

export default jobSlice.reducer;
