import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const { currentUser } = useAuth();

  return currentUser ? <Element {...rest} /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;