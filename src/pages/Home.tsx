// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import catImage from '../assets/cat_with_glasses_home.png';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');

  return (
    <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100 gap-4">
      {/* Get Started Section (Left) */}
      <div className="bg-light p-4 rounded shadow d-flex flex-column align-items-center" style={{ width: '90%', maxWidth: '250px' }}>
        <h2 className="h4 mb-3">GET STARTED...</h2>
        <img
          src={catImage} // Use the imported image as the source
          alt="Cat with glasses"
          className="rounded mb-3"
          style={{ width: '150px', height: 'auto' }}
        />
        <div className="d-grid gap-2 col-8 mx-auto">
          <button onClick={handleRegisterClick} className="btn btn-primary">register</button>
          <button onClick={handleLoginClick} className="btn btn-primary">login</button>
        </div>
      </div>

      {/* Right Section */}
      <div className="bg-light p-4 rounded shadow" style={{ minWidth: '280px', maxWidth: '450px' }}>
        <h3 className="h5 fw-bold mb-3">Improve your grades <span className="text-primary">now!</span></h3>
        <ul className="list-unstyled text-start">
          <li className="mb-2">➤ Add your courses</li>
          <li className="mb-2">➤ Select Time Availability</li>
          <li className="mb-2">➤ Connect with other <strong>highly-rated scholars</strong></li>
          <li>➤ Study and improve your grades!</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
