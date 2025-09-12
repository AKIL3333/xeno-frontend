import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';

const Signup = () => {
  const [tenantName, setTenantName] = useState('');
  const [shopifyShop, setShopifyShop] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosClient.post('/auth/signup', {
        tenantName,
        shopifyShop,
        email,
        password,
      });

      alert('Signup successful! Please login to continue.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Tenant Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Tenant Name"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
          <input
            placeholder="Shopify Shop URL"
            value={shopifyShop}
            onChange={(e) => setShopifyShop(e.target.value)}
            required
          />
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
          <button type="submit">Signup</button>
        </form>

        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
