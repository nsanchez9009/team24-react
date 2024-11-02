import React, { useState } from 'react';
import { API_URL } from '../config';

interface School {
  id: string;
  name: string;
  city: string;
  state: string;
}

interface SchoolSearchModalProps {
  onClose: () => void;
  onSelectSchool: (school: string) => void;
}

const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({ onClose, onSelectSchool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${API_URL}/schools/search?name=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      const data = await response.json();
  
      // Map data based on the actual response keys
      setSchools(data.map((item: any) => ({
        id: item.id || 'unknown-id', // Provide a default if id is missing
        name: item["school.name"],
        city: item["school.city"],
        state: item["school.state"],
      })));
      setError(null);
    } catch (err) {
      setError('Error fetching schools');
      console.error(err);
    }
  };
  

  const handleSelectSchool = (school: string) => {
    onSelectSchool(school);
    onClose(); // Close the modal after selection
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Select Your School</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search for schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={handleSearch} className="btn btn-primary mb-3">Search</button>
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {schools.map((school) => (
                    <li key={school.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <strong>{school.name}</strong> - {school.city}, {school.state}
                    </div>
                    <button onClick={() => handleSelectSchool(school.name)} className="btn btn-outline-primary btn-sm">Select</button>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSearchModal;
