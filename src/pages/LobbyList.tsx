import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL, SOCKET_URL } from '../config';
import io from 'socket.io-client';

interface Lobby {
  _id: string;
  lobbyId: string;
  name: string;
  className: string;
  school: string;
  host: string;
  maxUsers: number;
  currentUsers: number;
}

const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'], secure: true });

const LobbyList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { className, school } = location.state as { className: string; school: string };
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [showCreateLobbyModal, setShowCreateLobbyModal] = useState(false);
  const [lobbyName, setLobbyName] = useState('');
  const [maxUsers, setMaxUsers] = useState<number>(4);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      try {
        const response = await fetch(`${API_URL}/user/getuser`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUser(data);
      } catch {
        setError('Failed to fetch user data.');
      }
    };
    fetchUserData();
  }, []);

  const fetchLobbies = async () => {
    try {
      const response = await fetch(`${API_URL}/lobbies/list?className=${className}&school=${school}`);
      if (!response.ok) throw new Error('Failed to fetch lobbies');
      const data = await response.json();
      setLobbies(data);
    } catch {
      setError('Error loading lobbies');
    }
  };

  useEffect(() => {
    fetchLobbies();

    // Listen for real-time updates
    socket.on('updateLobbyList', fetchLobbies);

    return () => {
      socket.off('updateLobbyList', fetchLobbies);
      socket.disconnect();
    };
  }, [className, school]);

  const createLobby = async () => {
    const token = sessionStorage.getItem('token');
    if (!lobbyName) {
      setError('Lobby name is required');
      return;
    }

    if (maxUsers < 2 || maxUsers > 4) {
      setError('Please choose between 2-4 users');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/lobbies/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: lobbyName,
          className,
          school,
          host: user?.username,
          maxUsers,
        }),
      });

      if (!response.ok) throw new Error('Failed to create lobby');
      const newLobby = await response.json();

      // Automatically join the newly created lobby
      joinLobby(newLobby.lobbyId, newLobby.name);
      setLobbyName('');
      setMaxUsers(4);
      setError(null);
    } catch {
      setError('Error creating lobby');
    }
  };

  const joinLobby = (lobbyId: string, lobbyName: string) => {
    if (!user?.username) {
      setError('You must be logged in to join a lobby.');
      return;
    }

    navigate(`/lobby/${lobbyId}`, {
      state: {
        lobbyId,
        lobbyName,
        className,
        school,
        username: user.username,
      },
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="bg-light p-4 rounded shadow" style={{ width: '100%', maxWidth: '600px' }}>
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/course-home')}>
          Back to Classes
        </button>

        <h2 className="text-center mb-4">Available Lobbies for {className}</h2>

        <button className="btn btn-primary w-100 mb-3" onClick={() => setShowCreateLobbyModal(true)}>
          Create Lobby
        </button>

        {lobbies.length ? (
          <ul className="list-group">
            {lobbies.map((lobby) => (
              <li key={lobby.lobbyId} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{lobby.name}</strong>
                  <span className="d-block small text-muted">Host: {lobby.host}</span>
                  <span className="d-block small text-muted">
                    {lobby.currentUsers}/{lobby.maxUsers} users
                  </span>
                </div>
                {lobby.currentUsers < lobby.maxUsers ? (
                  <button className="btn btn-primary btn-sm" onClick={() => joinLobby(lobby.lobbyId, lobby.name)}>
                    Join
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm" disabled>
                    Full
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted">No lobbies available</p>
        )}

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {showCreateLobbyModal && (
          <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create a New Lobby</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateLobbyModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Lobby Name"
                    value={lobbyName}
                    onChange={(e) => setLobbyName(e.target.value)}
                    className="form-control mb-3"
                    required
                  />
                  <label htmlFor="maxUsers" className="form-label">
                    Max Users (2-4)
                  </label>
                  <select
                    id="maxUsers"
                    className="form-select"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(Number(e.target.value))}
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowCreateLobbyModal(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={createLobby}>
                    Create Lobby
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

export default LobbyList;
