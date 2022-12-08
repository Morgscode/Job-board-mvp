import { createSlice } from '@reduxjs/toolkit';
import { default as ls } from '../../services/localStorage';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    id: null,
    role: null,
  },
  reducers: {
    login: (state, action) => {
      ls.set('jwt', action.payload);
      state.loggedIn = true;
    },
    logout: (state) => {
      ls.drop('jwt');
      state.loggedIn = false;
      state.id = null;
      state.role = null;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, setId, setRole } = authSlice.actions;

export default authSlice.reducer;
