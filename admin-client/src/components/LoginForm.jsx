import { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

function LoginForm(props) {
  const toast = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  async function handleFormSubmit(submit) {
    setLoggingIn(true);
    submit.preventDefault();
    try {
      await props.login({
        email,
        password,
      });
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: 'error',
        summary: 'Incorrect login details',
      });
    } finally {
      setLoggingIn(false);
    }
  }

  return (
    <div className="flex align-items-center justify-content-center">
      <form
        className="p-8 border-round border-gray-50 border-solid border-1 shadow-1"
        onSubmit={handleFormSubmit}
      >
        <label className="block mb-2" htmlFor="email">
          Email
        </label>
        <div className="p-inputgroup mb-5">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText
            id="email"
            value={email}
            onInput={(e) => setEmail(e.target.value)}
          />
        </div>
        <label className="block mb-2" htmlFor="password">
          Password
        </label>
        <div className="p-inputgroup mb-3">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <Password
            id="password"
            name="password"
            feedback={false}
            value={password}
            onInput={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button label="Submit" aria-label="Submit" loading={loggingIn} />
        <Toast ref={toast} />
      </form>
    </div>
  );
}

export default LoginForm;
