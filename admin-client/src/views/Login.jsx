import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { http } from '../services/http';

function Login() {
  const navigate = useNavigate();
  async function login(user) {
    const res = await http.post('/login', user);
    console.log(res);
    if (res.status !== 200) {
      return false;
    }
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
