import { createSlice } from '@reduxjs/toolkit';

export const uploadSlice = createSlice({
  name: 'uploads',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setUploads: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
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

export const { setUploads, setPage, setSortOrder, uopdateUpload, deleteUpload } = uploadSlice.actions;

export default uploadSlice.reducer;
