import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import { SOCKET_URL } from '../config';

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  secure: true,
});

interface Message {
  username: string;
  text: string;
}

const LobbyPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userList, setUserList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lobbyId, lobbyName, className, school, username } = location.state || {};

  useEffect(() => {
    if (!lobbyId || !lobbyName || !className || !school || !username) {
      console.error('Invalid lobby details provided.');
      navigate('/course-home');
      return;
    }

    console.log(`Joining lobby: ${lobbyId} as ${username}`);
    // Join the lobby
    socket.emit('joinLobby', { lobbyId, username });

    // Real-time event listeners
    socket.on('userList', (users: string[]) => setUserList(users));
    socket.on('receiveMessage', (message: Message) => setMessages((prev) => [...prev, message]));
    socket.on('lobbyClosed', () => {
      setError('The lobby was closed by the host.');
      navigate('/course-home'); // Navigate back when lobby closes
    });
    socket.on('error', (serverError: string) => setError(serverError));

    const handleLeave = () => {
      socket.emit('leaveLobby', { lobbyId, username });
      console.log(`User ${username} left lobby: ${lobbyId}`);
    };

    window.addEventListener('beforeunload', handleLeave);

    return () => {
      handleLeave();
      socket.off('userList');
      socket.off('receiveMessage');
      socket.off('lobbyClosed');
      socket.off('error');
      window.removeEventListener('beforeunload', handleLeave);
    };
  }, [lobbyId, username, navigate]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      socket.emit('sendMessage', { lobbyId, message: inputMessage, username });
      setInputMessage('');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      {error && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Lobby Closed</h5>
              </div>
              <div className="modal-body">
                <p>{error}</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => navigate('/course-home')} className="btn btn-primary">Back to Classes</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex">
        {/* Lobby Details */}
        <div className="bg-light p-3 rounded shadow me-3" style={{ minWidth: '200px' }}>
          <h5>{lobbyName}</h5>
          <p><strong>Class:</strong> {className}</p>
          <p><strong>School:</strong> {school}</p>
          <p><strong>Users:</strong></p>
          <ul>
            {userList.map((user) => (
              <li key={user}>{user}</li>
            ))}
          </ul>
          <button
            onClick={() => {
              socket.emit('leaveLobby', { lobbyId, username });
              navigate('/course-home');
            }}
            className="btn btn-danger mt-3"
          >
            Leave Lobby
          </button>
        </div>

        {/* Chat Box */}
        <div className="bg-light p-3 rounded shadow flex-grow-1" style={{ width: '500px' }}>
          <div
            style={{
              height: '400px',
              overflowY: 'auto',
              padding: '10px',
              border: '1px solid #ccc',
              marginBottom: '10px',
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.username}</strong>: {msg.text}
              </div>
            ))}
          </div>
          <div className="d-flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="form-control me-2"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
