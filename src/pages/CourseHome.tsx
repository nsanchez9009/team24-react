import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from '../config';
import SchoolSearchModal from '../components/SchoolSearchModal';
import { useNavigate } from 'react-router-dom';
import background from '../assets/background.jpg';

interface User {
  username: string;
  classes: string[];
  school: string | null;
}

const CourseHome: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [courseNumber, setCourseNumber] = useState<string>('');
  const navigate = useNavigate();

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

  const updateUserSchool = async (school: string) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/user/updateSchool`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ school }),
      });

      if (!response.ok) {
        throw new Error('Failed to update school');
      }

      setUser((prevUser) => prevUser ? { ...prevUser, school } : null);
    } catch (err) {
      setError('Error updating school');
      console.error(err);
    }
  };

  const addClass = async () => {
    if (!subject || subject.length !== 3 || !courseNumber) {
      setError('Please enter a valid 3-character subject and course number');
      return;
    }

    const className = `${subject.toUpperCase()}${courseNumber.toUpperCase()}`;

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/user/addclass`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ className }),
      });

      if (!response.ok) {
        throw new Error('Failed to add class');
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update the user data with the new class list
      setSubject(''); // Clear input fields
      setCourseNumber('');
      setError(null); // Clear error
    } catch (err) {
      setError('Error adding class');
      console.error(err);
    }
  };

  const deleteClass = async (className: string) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${API_URL}/user/deleteclass`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ className }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete class');
      }

      // Update local user state to remove the class
      setUser((prevUser) =>
        prevUser ? { ...prevUser, classes: prevUser.classes.filter((cls) => cls !== className) } : null
      );

      setConfirmDelete(null); // Close confirmation modal
    } catch (err) {
      setError('Error deleting class');
      console.error(err);
    }
  };

  const handleDeleteClick = (className: string) => {
    setConfirmDelete(className); // Show confirmation modal
  };
  
  const handleClassSelect = (className: string) => {
    if (user?.school) {
      navigate('/lobby-list', { state: { className, school: user.school } });
    } else {
      setError('Please select a school first');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '89vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
      }}
    >
      <div className="container d-flex justify-content-center align-items-center">
        <div className="row w-100" style={{ maxWidth: '1000px', fontFamily: '"Karla", sans-serif' }}>
          
          {/* Left Box - List of Classes */}
          <div className="col-md-6 p-3" style={{backgroundColor: '#DCE9EE',}}>
            <div className="bg-light p-4 rounded shadow" style={{fontFamily: '"Karla", sans-serif' }}>
              {user && <h3 className="text-center"> 
              Welcome, <span className="fw-bold">{user.username}</span>!
              </h3>}
              <h4 className="text-center mt-4">Your Classes</h4>
              <ul className="list-group mt-3">
                {user?.classes.length ? (
                  user.classes.map((course, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {course}
                      <div>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: '#6193A9', color: '#fff', marginRight: '5px' }}
                        onClick={() => handleClassSelect(course)}
                      >
                        Select
                      </button>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: '#d9534f', color: '#fff' }}                          
                          onClick={() => handleDeleteClick(course)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-center">No classes added yet</li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Box - Selected School and Add Class Form */}
          <div className="col-md-6 p-3">
            <div className="bg-light p-4 rounded shadow d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="m-0 flex-grow-1 text-wrap">
                  {user?.school ? user.school : 'No school selected'}
                </h5>
                <button className="btn btn-secondary btn-sm ms-2" style={{ minWidth: '80px' }} onClick={() => setShowModal(true)}>Change</button>
              </div>

              {/* Add Class Form */}
              <h5 className="text-center">Add a New Class</h5>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  maxLength={3} // Limit subject input to 3 characters
                  style={{ minWidth: '100px' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Course Number"
                  value={courseNumber}
                  onChange={(e) => setCourseNumber(e.target.value)}
                  style={{ minWidth: '150px', marginLeft: '8px' }}
                />
                <button
                  className="btn btn-primary"
                  type="button"
                  style={{ backgroundColor: '#6193A9', borderColor: '#9BBECD', color: '#fff' }}
                  onClick={addClass}
                >
                  Add Class
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* School Search Modal */}
        {showModal && (
          <SchoolSearchModal
            onClose={() => setShowModal(false)}
            onSelectSchool={updateUserSchool}
          />
        )}

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setConfirmDelete(null)}
                ></button>
              </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete the class <strong>{confirmDelete}</strong>?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteClass(confirmDelete)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseHome;
