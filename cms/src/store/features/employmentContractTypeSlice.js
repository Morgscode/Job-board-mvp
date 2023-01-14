import { createSlice } from '@reduxjs/toolkit';

export const employmentContractTypeSlice = createSlice({
  name: 'employmentContractTypes',
  initialState: {
    data: [],
    page: 1,
    firstRow: 0,
    sortOrder: 'asc',
    totalRecords: 0,
  },
  reducers: {
    setContractTypes: (state, action) => {
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
    addContractType: (state, action) => {
      state.data = [...state.data, action.payload];
    },
    deleteContractType: (state, action) => {
      state.data = state.data.filter((type) => type.id !== action.payload);
    },
  },
});

export const {
  setContractTypes,
  setPage,
  setFirstRow,
  setTotalRecords,
  setSortOrder,
  addContractType,
  deleteContractType,
} = employmentContractTypeSlice.actions;

export default employmentContractTypeSlice.reducer;
