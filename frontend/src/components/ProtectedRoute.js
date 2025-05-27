import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// This component will check if user is logged in and has the correct role
const ProtectedRoute = () => {
  // Check if user is logged in by looking for token in sessionStorage
  const isAuthenticated = !!sessionStorage.getItem('token');
  const userType = sessionStorage.getItem('tipo');
  const userRoles = sessionStorage.getItem('allUserTypes')?.split(',') || [];
  const isGestor = userType === 'Gestor' || userRoles.includes('Gestor');
  const isFormador = userType === 'Formador' || userRoles.includes('Formador');
  
  // Get the current path
  const currentPath = window.location.pathname;
  
  // Check if the current path is a gestor or formador route
  const isGestorRoute = currentPath.startsWith('/gestor');
  const isFormadorRoute = currentPath.startsWith('/formador');
  
  // If trying to access gestor routes without being a gestor, redirect to home
  if (isGestorRoute && !isGestor) {
    return <Navigate to="/" />;
  }

  // If trying to access formador routes without being a formador, redirect to home
  if (isFormadorRoute && !isFormador) {
    return <Navigate to="/" />;
  }
  
  // If authenticated, show the route's children (outlet)
  // If not authenticated, redirect to homepage
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;