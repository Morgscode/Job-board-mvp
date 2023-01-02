import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutFn } from '../store/features/authSlice';

export default function useLogout() {
  const [logout, setLogout] = useState(false);
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (loggedIn && logout) {
      setLogout(false);
      dispatch(logoutFn());
      router.push('/login');
    }
  }, [loggedIn, logout, dispatch, router]);

  function triggerLogout() {
    setLogout(true);
  }

  return triggerLogout;
}
