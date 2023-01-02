import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import jobReducer from './features/jobSlice';
import jobApplicationReducer from './features/jobApplicationSlice';
import jobApplicationStatusReducer from './features/jobApplicationStatusSlice';
import jobCategoryReducer from './features/jobCategorySlice';
import salaryTypeReducer from './features/salaryTypeSlice';
import employmentContractTypeReducer from './features/employmentContractTypeSlice';
import locationReducer from './features/locationSlice';
import uploadReducer from './features/uploadSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    jobs: jobReducer,
    jobApplications: jobApplicationReducer,
    jobApplicationStatuses: jobApplicationStatusReducer,
    jobCategories: jobCategoryReducer,
    salaryTypes: salaryTypeReducer,
    employmentContractTypes: employmentContractTypeReducer,
    locations: locationReducer,
    uploads: uploadReducer,
  },
});
