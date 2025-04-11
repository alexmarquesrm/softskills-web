import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component will check if user is logged in and redirect if not
const ProtectedRoute = () => {
  // Check if user is logged in by looking for token in sessionStorage
  const isAuthenticated = !!sessionStorage.getItem('token');
  
  // If authenticated, show the route's children (outlet)
  // If not authenticated, redirect to homepage
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;