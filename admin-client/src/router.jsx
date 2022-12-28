import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Error from './views/Error';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ManageJobApplications from './views/JobApplications/ManageJobApplications';
import ManageJobApplication from './views/JobApplications/ManageJobApplication';
import ManageJobs from './views/Jobs/ManageJobs';
import CreateJob from './views/Jobs/CreateJob';
import EditJob from './views/Jobs/EditJob';
import ManageLocations from './views/Locations/ManageLocations';
import CreateLocation from './views/Locations/CreateLocation';
import EditLocation from './views/Locations/EditLocation';
import ManageJobCategories from './views/JobCategories/ManageJobCategories';
import CreateJobCategory from './views/JobCategories/CreateJobCategory';
import EditJobCategory from './views/JobCategories/EditJobCategory';
import ManageUploads from './views/Uploads/ManageUploads';
import ManageUpload from './views/Uploads/ManageUpload';
import CreateUpload from './views/Uploads/CreateUpload';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'job-applications',
        element: <ManageJobApplications />,
      },
      {
        path: 'job-applications/:id/manage',
        element: <ManageJobApplication />,
      },
      {
        path: 'jobs',
        element: <ManageJobs />,
      },
      {
        path: 'jobs/create',
        element: <CreateJob />,
      },
      {
        path: 'jobs/:id/edit',
        element: <EditJob />,
      },
      {
        path: '/locations',
        element: <ManageLocations />
      },
      {
        path: '/locations/create',
        element: <CreateLocation />
      },
      {
        path: '/locations/:id/edit',
        element: <EditLocation />
      },
      {
        path: '/job-categories',
        element: <ManageJobCategories />
      },
      {
        path: '/job-categories/create',
        element: <CreateJobCategory />
      },
      {
        path: '/job-categories/:id/edit',
        element: <EditJobCategory />
      },
      {
        path: '/uploads',
        element: <ManageUploads />
      },
      {
        path: '/uploads/create',
        element: <CreateUpload />
      },
      {
        path: '/uploads/:id/manage',
        element: <ManageUpload />
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
]);
