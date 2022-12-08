import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Error from './views/Error';
import Login from './views/Login';
import Dashboard from './views/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
  },
]);
