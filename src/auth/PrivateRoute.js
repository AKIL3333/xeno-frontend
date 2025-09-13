import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
//after login this component checks if token is present in local storage if not it redirects to login page
const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth.token) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;
