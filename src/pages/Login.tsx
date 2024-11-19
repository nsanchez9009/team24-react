import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import background from '../assets/background.jpg';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const backendUrl = `${API_URL}/auth/login`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.message === 'Please verify your email before logging in.') {
                setError('Please verify your email before logging in.');
            } else {
                setError('Invalid credentials');
            }
            return;
        }

        const data = await response.json();
        const token = data.token;
        sessionStorage.setItem('token', token);
        navigate('/course-home');
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',          alignItems: 'center',
        margin: 0,
        padding: 0,
        fontFamily: '"Karla", sans-serif',
      }}
    >
      <div className="bg-light p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>

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
          <div className="text-end">
            <small
              className="text-primary"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowModal(true)}
            >
              Forgot password?
            </small>
          </div>
        </div>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <button onClick={handleLogin} 
        className="btn btn-primary w-100 mb-3"
        style={{ backgroundColor: '#6193A9', borderColor: '#6193A9' }}
        >Login</button>

        <p className="text-center">
          <small>Don't have an account? <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span></small>
        </p>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal show={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
};

export default Login;
