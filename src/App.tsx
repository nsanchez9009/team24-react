// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CourseHome from './pages/CourseHome';

const AppHeader: React.FC = () => {
  const location = useLocation();

  // Show the Home button only on Register or Login pages
  const showHomeButton = location.pathname === '/register' || location.pathname === '/login';

  return (
    <header className="bg-light py-3 text-center d-flex justify-content-between align-items-center px-4">
      <h1 className="display-4 fw-bold m-0">STUDY BUDDY</h1>
      {showHomeButton && (
        <Link to="/" className="btn btn-secondary">Home</Link>
      )}
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
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/course-home" element={<CourseHome />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
