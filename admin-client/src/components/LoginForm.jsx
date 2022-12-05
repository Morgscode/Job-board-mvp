import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

function LoginForm() {
  const username = '';
  const password = '';

  return (
    <div className="flex align-items-center justify-content-center">
      <form className="p-8 border-round border-gray-50 border-solid border-1 shadow-1">
        <label className="block mb-2" htmlFor="username">Username</label>
        <div className="p-inputgroup mb-5">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText id="username" value={username} />
        </div>
        <label className="block mb-2" htmlFor="password">Password</label>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <Password id="password" value={password} />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
