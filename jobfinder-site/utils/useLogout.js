import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutFn } from '../store/features/authSlice';
import axios from 'axios';

export default function useLogout() {
  const [logout, setLogout] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const secureLogout = useCallback(
    async function () {
      await axios.get('/api/logout');
      setLogout(false);
      dispatch(logoutFn());
      router.push('/login');
    },
    [router, dispatch]
  );

  useEffect(() => {
    if (logout) {
      secureLogout();
    }
  }, [logout, secureLogout]);

  function triggerLogout() {
    setLogout(true);
  }

  return triggerLogout;
}
