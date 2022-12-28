import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/features/authSlice';
import Sidebar from './components/Sidebar';
import appStore from './store/appStore';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login');
    }
  }, [loggedIn]);

  function logoutUser() {
    dispatch(logout());
  }
  
  return (
    <div className="App w-full min-h-screen p-0 m-0">
      <div className="flex h-full">
        <aside className="w-2 min-h-screen">
          <Sidebar logout={logoutUser} />
        </aside>
        <div className="w-12 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
