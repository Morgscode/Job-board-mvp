import { createSlice } from '@reduxjs/toolkit';

export const salaryTypeSlice = createSlice({
  name: 'salaryTypes',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setSalaryTypes: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    deleteSalaryType: (state, action) => {
      state.data = state.data.filter(type => type.id !== action.payload);
    }
  },
});

export const { setSalaryTypes, setPage, setSortOrder, deleteSalaryType } = salaryTypeSlice.actions;

export default salaryTypeSlice.reducer;
