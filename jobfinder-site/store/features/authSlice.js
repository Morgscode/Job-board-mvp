import { createSlice } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { default as ls } from '../../utils/localStorage';
import { http } from '../../services/http';


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loggedIn: false,
    loggedInUser: {},
  },
  reducers: {
    login: (state, action) => {
      ls.set('jwt', action.payload);
      state.loggedIn = true;
      http.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${action.payload}`;
    },
    logout: (state) => {
      ls.drop('jwt');
      state.loggedIn = false;
      state.loggedInUser = {};
      http.defaults.headers.common['Authorization'] = ``;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
});

export const { login, logout, setLoggedInUser } = authSlice.actions;

export default authSlice.reducer;
