import { createSlice } from '@reduxjs/toolkit';
import { default as ls } from '../../utils/localStorage';
import { http } from '../../services/http';

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
      http.defaults.headers.common['Authorization'] = `Bearer ${action.payload}`;
    },
    logout: (state) => {
      ls.drop('jwt');
      state.loggedIn = false;
      state.id = null;
      state.role = null;
      http.defaults.headers.common['Authorization'] = ``;
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
