import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  if (!loggedIn) {
    const navigate = useNavigate();
    useEffect(() => {
      navigate('/login');
    });
  }

  return (
    <div className="App w-full min-h-screen p-0 m-0">
      App layout
      <Outlet />
    </div>
  );
}

export default App;
