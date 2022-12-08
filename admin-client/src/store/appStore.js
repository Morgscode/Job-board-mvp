import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer
  },
})