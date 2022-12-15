import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import jobReducer from './features/jobSlice';
import locationReducer from './features/locationSlice';
import jobCategoryReducer from './features/jobCategorySlice';
import salaryTypeReducer from './features/salaryTypeSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer,
    locations: locationReducer,
    jobCategories: jobCategoryReducer,
    salaryTypes: salaryTypeReducer,
  },
});