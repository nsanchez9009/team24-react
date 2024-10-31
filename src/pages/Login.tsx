// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Placeholder login function
  const handleLogin = () => {
    alert('Login functionality to be implemented');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="bg-light p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>

        {/* Username Input */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {/* Forgot Password Link */}
          <div className="text-end">
            <small className="text-primary" style={{ cursor: 'pointer' }}>Forgot password?</small>
          </div>
        </div>

        {/* Login Button */}
        <button onClick={handleLogin} className="btn btn-primary w-100 mb-3">Login</button>

        {/* Link to Register Page */}
        <p className="text-center">
          <small>Don't have an account? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span></small>
        </p>
      </div>
    </div>
  );
};

export default Login;
