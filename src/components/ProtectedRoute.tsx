import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAdminLoggedIn } = useApp();
  
  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;