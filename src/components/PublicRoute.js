import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const PublicRoute = ({ children }) => {
  const userLoggedIn = useAuth()
  return !userLoggedIn ? children : <Navigate to='/inbox'> </Navigate>
};

export default PublicRoute;