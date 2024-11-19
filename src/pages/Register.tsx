// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config.ts';
import background from '../assets/background.jpg';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const backendUrl = `${API_URL}/auth/register`;

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Email validation
    if (name === 'email') {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      setEmailError(emailPattern.test(value) ? '' : 'Please enter a valid email');
    }
  };

  // Handle form submission
  const handleRegister = async () => {
    if (emailError || !form.username || !form.password || !form.email) {
      setError('Please fill in all fields correctly.');
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to register. Please try again.');
      }

      setSuccess('Registration successful! Please check your email to verify your account.');
      setError('');
      
      // Simulate navigation to Login page after registration
      setTimeout(() => navigate('/login'), 1500);

    } catch (err) {
      setError((err as Error).message || 'An error occurred during registration.');
      setSuccess('');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        fontFamily: '"Karla", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div className="bg-light p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Register</h2>
        
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
        </div>

        {/* Email Input with Validation */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>

        {/* Error and Success Messages */}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {success && <div className="alert alert-success text-center">{success}</div>}

        {/* Register Button */}
        <button onClick={handleRegister}
        className="btn btn-primary w-100 mb-3"
        style={{ backgroundColor: '#6193A9', borderColor: '#6193A9' }}
        >Register</button>

        {/* Link to Login Page */}
        <p className="text-center">
          <small>Already have an account? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span></small>
        </p>
      </div>
    </div>
  );
};

export default Register;
