import { createSlice } from '@reduxjs/toolkit';
import { default as ls } from '../../services/localStorage';

export const jobSlice = createSlice({
  name: 'auth',
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
      state.sortOrder = action.payload
    }
  },
});

export const { setJobs } = jobSlice.actions;

export default jobSlice.reducer;
