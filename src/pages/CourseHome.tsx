// src/pages/CourseHome.tsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';

interface User {
  username: string;
  classes: string[];
  school: string | null;
}

const CourseHome: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${API_URL}/user/getuser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError('Error loading user data');
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="row w-100" style={{ maxWidth: '800px' }}>
        
        {/* Left Box - List of Classes */}
        <div className="col-md-6 p-3">
          <div className="bg-light p-4 rounded shadow">
            {user && <h3 className="text-center">Welcome, {user.username}!</h3>}
            <h4 className="text-center mt-4">Your Classes</h4>
            <ul className="list-group mt-3">
              {user?.classes.length ? (
                user.classes.map((course, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {course}
                    <div>
                      <button className="btn btn-sm btn-primary me-2">Select</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center">No classes added yet</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Box - Selected University and Search */}
        <div className="col-md-6 p-3">
          <div className="bg-light p-4 rounded shadow">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0">
                {user?.school ? user.school : 'No school selected'}
              </h5>
              <button className="btn btn-secondary btn-sm">Change</button>
            </div>

            {/* Search Bar */}
            <h5 className="text-center">Search for Classes</h5>
            <div className="input-group mt-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search for classes..."
                aria-label="Search for classes"
              />
              <button className="btn btn-primary" type="button">Search</button>
            </div>
          </div>
        </div>

      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default CourseHome;
