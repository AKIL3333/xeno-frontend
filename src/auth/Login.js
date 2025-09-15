import React, { useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';
// this is the login component where tenants can log in using their email and password
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);//getting login function from auth context which sets tenants id,toke, email and name in local storage
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    //making post request to login endpoint with email and password
    try {
      const res = await axiosClient.post('/auth/login', { email, password });

      login({ //on successful login we are storing token,tenant id,email and tenant name in local storage
        token: res.data.token,
        tenantId: res.data.tenantId,
        email,
        tenantName: res.data.tenantName,
      });

      navigate('/dashboard');//navigating to dashboard on successful login
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <h1>Data Ingestion & Insights Applications</h1>
      </header>

      <div className="auth-container">
        <div className="auth-box">
          <h2>Tenant Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>

          {error && <p className="error">{error}</p>}
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
            <p className="server-hint">
      Note: For the first login attempt, the server may take 1–2 minutes to boot up.  
      If login does not work immediately, please try again after a short wait.
    </p>
      </div>
    </div>
  );
};

export default Login;
