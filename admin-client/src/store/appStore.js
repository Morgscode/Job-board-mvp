import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import authReducer from './features/authSlice';
import jobApplicationReducer from './features/jobApplicationSlice';
import jobReducer from './features/jobSlice';
import locationReducer from './features/locationSlice';
import jobCategoryReducer from './features/jobCategorySlice';
import salaryTypeReducer from './features/salaryTypeSlice';
import employmentContractTypeReducer from './features/employmentContractTypeSlice';
import jobApplicationStatusReducer from './features/jobApplicationStatusSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    jobs: jobReducer,
    jobCategories: jobCategoryReducer,
    jobApplications: jobApplicationReducer,
    jobApplicationStatuses: jobApplicationStatusReducer,
    salaryTypes: salaryTypeReducer,
    employmentContractTypes: employmentContractTypeReducer,
    locations: locationReducer,
  },
});
