import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = new URLSearchParams(location.search).get('token');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleResetPassword = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            if (!response.ok) throw new Error('Failed to reset password');

            setSuccess('Password reset successfully!');
            setError(''); // Clear any previous error message
        } catch (error) {
            setError('Failed to reset password. Please try again.');
            setSuccess(''); // Clear any previous success message
        }
    };

    return (
        <div className="container">
            <h2>Reset Password</h2>
            
            {!success ? (
                <>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control my-3"
                    />
                    <button onClick={handleResetPassword} className="btn btn-primary">Submit</button>
                </>
            ) : (
                <>
                    <p className="text-success">{success}</p>
                    <button onClick={() => navigate('/login')} className="btn btn-primary mt-3">
                        Back to Login
                    </button>
                </>
            )}

            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
};

export default ResetPassword;
