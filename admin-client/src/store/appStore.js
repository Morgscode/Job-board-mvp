import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import jobReducer from './features/jobSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer
  },
});