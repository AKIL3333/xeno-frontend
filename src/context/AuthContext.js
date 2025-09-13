import React, { createContext, useState } from 'react';
// Context to manage authentication state
export const AuthContext = createContext();
//using this provider we can wrap our app and provide auth state to all components
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    tenantId: localStorage.getItem('tenantId') || null,
    email: localStorage.getItem('email') || null,
    tenantName: localStorage.getItem('tenantName') || null, 
  });
//on login we store the token and tenant id in local storage
  const login = ({ token, tenantId, email, tenantName }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('email', email);
    localStorage.setItem('tenantName', tenantName); 
    setAuth({ token, tenantId, email, tenantName });
  };
//on logout we clear the local storage and reset auth state but logout functionality isnt complete yet
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('email');
    localStorage.removeItem('tenantName'); 
    setAuth({ token: null, tenantId: null, email: null, tenantName: null });
  };
//providing auth state and login/logout functions to children components
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
