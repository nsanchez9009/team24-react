import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';

const VerifyEmail: React.FC = () => {
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the token from the URL query parameter
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message || 'Email verified successfully!');
                } else {
                    setMessage(data.message || 'Email verification failed. Invalid or expired token.');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setMessage('An error occurred. Please try again.');
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setMessage('No token provided for verification.');
        }
    }, [token]);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-89">
            <div className="bg-light p-4 rounded shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4">Email Verification</h2>
                {message ? (
                    <p className="text-center">{message}</p>
                ) : (
                    <p className="text-center">Verifying...</p>
                )}
                <button onClick={() => navigate('/login')} className="btn btn-primary w-100 mt-3">
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
