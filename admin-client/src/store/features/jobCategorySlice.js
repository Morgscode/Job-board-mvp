import { createSlice } from '@reduxjs/toolkit';

export const jobCategorySlice = createSlice({
  name: 'jobCategories',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setJobCategories: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    deleteJobCategory: (state, action) => {
      state.data = state.data.filter(job => job.id !== action.payload);
    }
  },
});

export const { setJobCategories, setPage, setSortOrder, deleteJob } = jobCategorySlice.actions;

export default jobCategorySlice.reducer;
