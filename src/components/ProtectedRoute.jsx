import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
 import Icon from'./AppIcon';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check role-based access if required
  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <Icon name="ShieldX" size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access this page. Required role: {requiredRole}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute