import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';

interface BellmanProtectedRouteProps {
  children: React.ReactNode;
}

const BellmanProtectedRoute: React.FC<BellmanProtectedRouteProps> = ({ children }) => {
  const { user, userProfile, loading } = useFirebase();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }
  
  if (!user || !userProfile || userProfile.role !== 'bellman') {
    return <Navigate to="/bellman-login" replace />;
  }
  
  return <>{children}</>;
};

export default BellmanProtectedRoute;