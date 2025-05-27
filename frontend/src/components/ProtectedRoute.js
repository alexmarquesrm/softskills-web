import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// This component will check if user is logged in and has the correct role
const ProtectedRoute = ({ allowedRoles }) => {
  const token = sessionStorage.getItem('token');
  const userType = sessionStorage.getItem('tipo');
  const allUserTypes = sessionStorage.getItem('allUserTypes')?.split(',') || [];
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check if trying to access formando routes
  if (location.pathname.startsWith('/utilizadores')) {
    // If user is not a formando, redirect to appropriate dashboard
    if (userType !== 'Formando') {
      if (userType === 'Formador') {
        return <Navigate to="/formador/dashboard" replace />;
      } else if (userType === 'Gestor') {
        return <Navigate to="/gestor/dashboard" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  // If no specific roles are required, just check for authentication
  if (!allowedRoles) {
    return <Outlet />;
  }

  // Check if user has any of the allowed roles
  const hasAllowedRole = allowedRoles.some(role => 
    userType === role || allUserTypes.includes(role)
  );

  if (!hasAllowedRole) {
    // Redirect to appropriate dashboard based on user type
    if (userType === 'Formador') {
      return <Navigate to="/formador/dashboard" replace />;
    } else if (userType === 'Gestor') {
      return <Navigate to="/gestor/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;