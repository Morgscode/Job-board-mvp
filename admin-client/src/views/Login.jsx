import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { http } from '../services/http';

function Login() {

  async function login(user) {
    const res = await http.post('/login', user);
    console.log(res);
  }

  return (
    <div className="login w-full h-full flex flex-column align-items-center justify-content-center">
        <h2 className="text-4xl font-semibold">Login</h2>
        <LoginForm />
    </div>
  );
}

export default Login;
