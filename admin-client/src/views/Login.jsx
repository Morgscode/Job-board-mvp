import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  login as loginUser,
  setId,
  setRole,
} from '../store/features/authSlice';
import { setDetails } from '../store/features/userSlice';
import { http } from '../services/http';
import LoginForm from '../components/auth/LoginForm';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function login(request) {
    const res = await http.post('/login', request);
    if (res.status !== 200) {
      return false;
    }
    if (res.data.data.user.role === 1) {
      return false;
       // redirect to job finder site
    }
    const { user } = res.data.data;
    const token = res.data.token;
    dispatch(loginUser(token));
    dispatch(setId(user.id));
    dispatch(setRole(user.role));
    dispatch(setDetails(user));
    navigate('/dashboard');
  }

  return (
    <div className="login w-full h-full flex flex-column align-items-center justify-content-center">
      <h2 className="text-4xl font-semibold">OJB Admin Login</h2>
      <LoginForm login={login} />
    </div>
  );
}

export default Login;
