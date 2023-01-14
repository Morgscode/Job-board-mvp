import { createSlice } from '@reduxjs/toolkit';

export const salaryTypeSlice = createSlice({
  name: 'salaryTypes',
  initialState: {
    data: [],
    page: 1,
    firstRow: 0,
    sortOrder: 'asc',
    totalRecords: 0,
  },
  reducers: {
    setSalaryTypes: (state, action) => {
      state.data = action.payload;
    },
    setTotalRecords: (state, action) => {
      state.totalRecords = action.payload;
    },
    setFirstRow: (state, action) => {
      state.firstRow = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    addSalaryType: (state, action) => {
      const types = [...state.data];
      state.data = [...types, action.payload];
    },
    updateSalaryType: (state, action) => {
      state.data = state.data.map((salaryType) =>
        salaryType.id === action.payload.id ? action.payload : salaryType
      );
    },
    deleteSalaryType: (state, action) => {
      state.data = state.data.filter((type) => type.id !== action.payload);
    },
  },
});

export const {
  setSalaryTypes,
  setPage,
  setFirstRow,
  setTotalRecords,
  setSortOrder,
  addSalaryType,
  updateSalaryType,
  deleteSalaryType,
} = salaryTypeSlice.actions;

export default salaryTypeSlice.reducer;
