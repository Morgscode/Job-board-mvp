import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'users',
  initialState: {
    data: [],
    page: 1,
    sortOrder: 'asc',
  },
  reducers: {
    setUsers: (state, action) => {
      state.data = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    addUser: (state, action) => {
      const users = [...state.data];
      state.data = [...users, action.payload];
    },
    updateUser: (state, action) => {
      state.data = state.data.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },
    deleteUser: (state, action) => {
      state.data = state.data.filter((user) => user.id !== action.payload);
    },
  },
});

export const { setUsers, setPage, setSortOrder, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
