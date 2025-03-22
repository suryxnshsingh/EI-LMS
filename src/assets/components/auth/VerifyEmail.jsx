import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
        .then(response => {
          setMessage(response.data.message);
          setSuccess(true);
        })
        .catch(error => {
          setMessage(error.response.data.message || 'Error verifying email');
          setSuccess(false);
        });
    } else {
      setMessage('Invalid verification link');
      setSuccess(false);
    }
  }, [location]);

  return (
    <div className="verify-email-container">
      <h1>Email Verification</h1>
      <p>{message}</p>
      {success && (
        <div>
          <p>Your email has been verified successfully. You can now log in.</p>
          <Link to="/signin">Go to Login</Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
