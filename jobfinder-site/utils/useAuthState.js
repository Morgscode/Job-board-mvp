import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector,  useDispatch} from 'react-redux';
import { refreshLoggedIn } from '../store/features/authSlice';

export default function useAuthState(authRequired = false, user = false) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  
  useEffect(() => {
    if (user) {
      dispatch(refreshLoggedIn(true));
    }
    if (!loggedIn && authRequired) {
      router.push('/login');
    }
  });

  return [loggedIn, loggedInUser];
}
