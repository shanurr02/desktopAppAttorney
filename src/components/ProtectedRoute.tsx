import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedGroups?: ('attorney' | 'client')[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedGroups,
  fallback 
}) => {
  const { isLoggedIn, isLoading, currentUser, logout } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/app/login" state={{ from: location }} replace />;
  }

  // Check if user has required group access
  if (allowedGroups && currentUser) {
    const userGroup = currentUser.group;
    if (!allowedGroups.includes(userGroup)) {
      // User doesn't have required group access - logout automatically
      logout();
      return <Navigate to="/app/login" state={{ from: location }} replace />;
    }
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
