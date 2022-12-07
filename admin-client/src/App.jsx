import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  });
  return (
    <div className="App w-full min-h-screen p-0 m-0">
      App layout
    </div>
  );
}

export default App;
