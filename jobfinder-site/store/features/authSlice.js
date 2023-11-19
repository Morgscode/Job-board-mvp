import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: false,
    loggedInUser: {},
  },
  reducers: {
    login: (state, action) => {
      state.loggedIn = true;
      state.loggedInUser = action.payload;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.loggedInUser = {};
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
