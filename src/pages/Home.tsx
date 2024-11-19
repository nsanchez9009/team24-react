import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import catImage from '../assets/cat_with_glasses_home.png';
import background from '../assets/background.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => navigate('/register');
  const handleLoginClick = () => navigate('/login');

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center w-100 gap-5">
        {/* Get Started Section */}
        <div
          className="bg-light p-4 rounded shadow d-flex flex-column align-items-center"
          style={{ width: '90%', maxWidth: '400px', height: 'auto' }}
        >
          <h2
            className="h4 mb-0"
            style={{
              fontFamily: "'Kameron', serif",
              fontSize: '2rem',
            }}
          >
            GET STARTED...
          </h2>
          <img
            src={catImage}
            alt="Cat with glasses"
            className="rounded mb-2"
            style={{ width: '200px', height: 'auto' }}
          />
          <div className="d-grid gap-2 col-8 mx-auto">
            <button
              onClick={handleRegisterClick}
              className="btn btn-primary"
              style={{
                backgroundColor: '#6193A9',
                borderColor: '#6193A9',
                color: 'white',
                fontFamily: "'Karla', sans-serif",
                fontSize: '20px',
              }}
            >
              Register
            </button>
            <button
              onClick={handleLoginClick}
              className="btn btn-primary"
              style={{
                backgroundColor: '#6193A9',
                borderColor: '#6193A9',
                color: 'white',
                fontFamily: "'Karla', sans-serif",
                fontSize: '20px',
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div
          className="p-4 rounded shadow"
          style={{ minWidth: '280px', 
            maxWidth: '450px',
            fontFamily: "'Karla', sans-serif",
            fontSize: '18px',
            backgroundColor: '#DCE9EE',
          }}
        >
          <h3 className="h5 fw-bold mb-3">
            Improve your grades <span style={{ color: '#4B7080', textDecoration: 'underline' }}>NOW</span>!
          </h3>
          <ul className="list-unstyled text-start">
            <li className="mb-3">➤ Add your courses</li>
            <li className="mb-3">➤ Select Time Availability</li>
            <li className="mb-3">➤ Connect with other <strong>highly-rated scholars</strong></li>
            <li>➤ Study and improve your grades!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
