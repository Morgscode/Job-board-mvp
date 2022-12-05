import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  useEffect(() => {
    const navigate = useNavigate();
    navigate('/login');
  });

  return (
    <div className="App w-screen min-h-screen p-0 m-0">
      <div>Welcome to the app</div>
    </div>
  );
}

export default App;
