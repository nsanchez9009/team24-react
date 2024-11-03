import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) throw new Error('Failed to reset password');

            setSuccess('Password reset successfully!');
            setError('');
        } catch (error) {
            setError('Failed to reset password. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="bg-light p-4 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Reset Password</h2>
                
                {!success ? (
                    <>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control my-3"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control mb-3"
                        />
                        <button onClick={handleResetPassword} className="btn btn-primary w-100">Submit</button>
                    </>
                ) : (
                    <>
                        <p className="text-success text-center">{success}</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary w-100 mt-3">
                            Back to Login
                        </button>
                    </>
                )}

                {error && <p className="text-danger text-center mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
