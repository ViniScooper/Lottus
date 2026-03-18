import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/adm/login" replace />;
};

export default PrivateRoute;
