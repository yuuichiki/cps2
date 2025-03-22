
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ requiredPermission }) => {
  const { isAuthenticated, loading, checkPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If permission is required, check if user has it
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return <Navigate to="/500" state={{ 
      errorMessage: "You don't have permission to access this page" 
    }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
