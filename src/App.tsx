import React from 'react';
import { GoHomeFill } from "react-icons/go";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CourseHome from './pages/CourseHome';
import VerifyEmail from './pages/VerifyEmail';
import ResetPassword from './pages/ResetPassword';
import LobbyList from './pages/LobbyList';
import LobbyPage from './pages/LobbyPage';

const AppHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in by verifying the presence of a token in sessionStorage
  const isLoggedIn = Boolean(sessionStorage.getItem('token'));

  // Show the Home button only on Register or Login pages
  const showHomeButton = location.pathname === '/register' || location.pathname === '/login';

  // Handle logout: clear sessionStorage and redirect to Home page
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-light py-3 text-center d-flex justify-content-between align-items-center px-4">
      <h1 className="display-4 fw-bold m-0">STUDY BUDDY</h1>
      <div>
      {showHomeButton && (
          <Link
            to="/"
            className="btn me-2"
            style={{
              backgroundColor: '#9BBECD', // Apply custom color
              borderColor: '#9BBECD',
              color: 'white', // Text color
              fontFamily: '"Karla", sans-serif',
              fontSize: '20px',
            }}
          >
            <GoHomeFill style={{ marginRight: '4px', marginBottom: '4px', color: 'white' }} />
            Home
          </Link>
        )}
        {isLoggedIn && (
          <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
        )}
      </div>
    </header>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        {/* Persistent Header */}
        <AppHeader />

        {/* Main Content - Full Height Below Header */}
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/course-home" element={<CourseHome />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/lobby-list" element={<LobbyList />} />
            <Route path="/lobby/:lobbyId" element={<LobbyPage />} />
            {/* Wildcard route as the last route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
