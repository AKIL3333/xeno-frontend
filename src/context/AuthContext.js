import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    tenantId: localStorage.getItem('tenantId') || null,
    email: localStorage.getItem('email') || null,
    tenantName: localStorage.getItem('tenantName') || null, // <-- add tenantName
  });

  const login = ({ token, tenantId, email, tenantName }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('email', email);
    localStorage.setItem('tenantName', tenantName); // <-- store tenantName
    setAuth({ token, tenantId, email, tenantName });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('email');
    localStorage.removeItem('tenantName'); // <-- remove tenantName
    setAuth({ token: null, tenantId: null, email: null, tenantName: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
