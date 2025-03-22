import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail } from 'lucide-react';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email?token=${token}`)
        .then(response => {
          setMessage(response.data.message);
          setSuccess(true);
          setTimeout(() => {
            navigate("/signin");
          }, 1000); // Redirect after 3 seconds
        })
        .catch(error => {
          setMessage(error.response.data.message || 'Error verifying email');
          setSuccess(false);
        });
    } else {
      setMessage('Invalid verification link');
      setSuccess(false);
    }
  }, [location, navigate]);

  return (
    <div className="bg-white dark:bg-black dark:bg-dot-white/[0.2] bg-dot-black/[0.2] h-screen flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="max-w-md w-full mx-3 rounded-2xl p-4 md:p-8 border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black">
        <h2 className="font-bold text-center text-xl text-neutral-800 dark:text-neutral-200">
          EI-LMS
        </h2>
        <div className="my-8">
          <h1 className="text-center text-2xl font-semibold text-neutral-800 dark:text-neutral-200 pb-2">Email Verification</h1>
          <p className="text-center text-neutral-600 dark:text-neutral-400">{message}</p>
          {success && (
            <div className="mt-4 text-center">
              <p className="text-green-500">Account verified successfully. Redirecting to login...</p>
              <Link to="/signin" className="mt-4 inline-block bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 text-white rounded-md h-10 px-4 py-2 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                Go to Login &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
