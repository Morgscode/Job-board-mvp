import { createSlice } from '@reduxjs/toolkit';

export const uploadSlice = createSlice({
  name: 'uploads',
  initialState: {
    data: [],
    page: 1,
    firstRow: 0,
    sortOrder: 'asc',
    totalRecords: 0,
  },
  reducers: {
    setUploads: (state, action) => {
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
    addUpload: (state, action) => {
      const uploads = [...state.data];
      state.data = [...uploads, action.payload];
    },
    updateUpload: (state, action) => {
      state.data = state.data.map((upload) =>
        upload.id === action.payload.id ? action.payload : upload
      );
    },
    deleteUpload: (state, action) => {
      state.data = state.data.filter((upload) => upload.id !== action.payload);
    },
  },
});

export const {
  setUploads,
  setPage,
  setFirstRow,
  setTotalRecords,
  setSortOrder,
  addUpload,
  updateUpload,
  deleteUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
