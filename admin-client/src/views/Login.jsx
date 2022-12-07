import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { http } from '../services/http';
import { sleep } from '../utils/sleep';

function Login() {
  const navigate = useNavigate();
  async function login(user) {
    const res = await http.post('/login', user);
    if (res.status !== 200) {
      return false;
    }
    console.log(res);
    if (res.data.data.user.role === 1) {
      return false;
    }
    await sleep(1000);
    navigate('/dashboard');
  }

  return (
    <div className="login w-full h-full flex flex-column align-items-center justify-content-center">
        <h2 className="text-4xl font-semibold">Login</h2>
        <LoginForm login={login} />
    </div>
  );
}

export default Login;
