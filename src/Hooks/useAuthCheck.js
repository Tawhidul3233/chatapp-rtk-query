import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLoggedIn } from '../features/auth/authSlice';

const useAuthCheck = () => {

  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const localAuth = localStorage?.getItem('auth')
    if (localAuth) {
      const auth = JSON.parse(localAuth)
      if (auth?.accessToken && auth?.user) {
        dispatch(userLoggedIn({
          accessToken: auth?.accessToken,
          user: auth?.user
        }))
      }
    } 
    setAuthChecked(true)

  }, [setAuthChecked, dispatch])
  return authChecked;
};

export default useAuthCheck;