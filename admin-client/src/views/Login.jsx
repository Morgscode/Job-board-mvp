import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  login as loginUser,
  setId,
  setRole,
} from '../store/features/authSlice';
import { setDetails } from '../store/features/userSlice';
import { http } from '../services/http';
import { sleep } from '../utils/sleep';
import LoginForm from '../components/LoginForm';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function login(user) {
    const res = await http.post('/login', user);
    if (res.status !== 200) {
      return false;
    }
    if (res.data.data.user.role === 1) {
      return false;
    }
    const userDetails = res.data.data.user;
    const token = res.data.token;
    dispatch(loginUser(token));
    dispatch(setId(userDetails.id));
    dispatch(setRole(userDetails.role));
    dispatch(setDetails(userDetails));
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
