import { createSlice } from '@reduxjs/toolkit';

export const jobCategorySlice = createSlice({
  name: 'jobCategories',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    addCategory: (state, action) => {
      const categories = [...state.data];
      state.data = [...categories, action.payload];
    },
    updateCategory: (state, action) => {
      state.data = state.data.map((category) =>
        category.id === action.payload.id ? action.payload : category
      );
    },
    deleteCategory: (state, action) => {
      state.data = state.data.filter(
        (category) => category.id !== action.payload
      );
    },
  },
});

export const {
  setCategories,
  setPage,
  setSortOrder,
  addCategory,
  updateCategory,
  deleteCategory,
} = jobCategorySlice.actions;

export default jobCategorySlice.reducer;
