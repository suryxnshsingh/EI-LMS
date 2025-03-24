import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ component: Component, allowedRoles, redirectPath = '/signin' }) => {
  const [loading, setLoading] = useState(true);
  
  // Check if user is authenticated and authorized
  const token = Cookies.get('token');
  const userRole = Cookies.get('userRole');
  
  useEffect(() => {
    // If no token, user isn't logged in
    if (!token) {
      toast.error('Please sign in to continue');
      setLoading(false);
      return;
    }

    // If roles don't match, show unauthorized message
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      toast.error('You do not have permission to access this page');
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [token, userRole, allowedRoles]);

  if (loading) {
    // Return a loading state while we check authentication
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-green-500"></div>
      </div>
    );
  }

  // If no token or not authorized, redirect to login
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  // If roles don't match, redirect to appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    switch(userRole) {
      case 'STUDENT':
        return <Navigate to="/students" replace />;
      case 'TEACHER':
        return <Navigate to="/teachers" replace />;
      case 'ADMIN':
        return <Navigate to="/hod" replace />;
      default:
        return <Navigate to={redirectPath} replace />;
    }
  }

  // If authorized, render the component
  return <Component />;
};

export default ProtectedRoute;
