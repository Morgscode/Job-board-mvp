import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

export default function useAuthState(logout = false) {
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const loggedInUser = useSelector((state) => state.auth.loggedInUser);
  
  useEffect(() => {
    if (!loggedIn && logout) {
      router.push('/login');
    }
  });

  return [loggedIn, loggedInUser];
}
