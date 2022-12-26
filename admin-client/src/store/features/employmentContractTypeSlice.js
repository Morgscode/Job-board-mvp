import { createSlice } from '@reduxjs/toolkit';

export const employmentContractTypeSlice = createSlice({
  name: 'employmentContractTypes',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setContractTypes: (state, action) => {
      state.data = action.payload;
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
  setSortOrder,
  addContractType,
  deleteContractType,
} = employmentContractTypeSlice.actions;

export default employmentContractTypeSlice.reducer;
