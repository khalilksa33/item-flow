
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'viewer';
}

export function ProtectedRoute({ children, requiredRole = 'viewer' }: ProtectedRouteProps) {
  const { currentUser, isAdmin } = useUser();
  const location = useLocation();

  // Special case for admin route
  if (requiredRole === 'admin') {
    // Only allow access if user is admin (checking both the isAdmin function and current user role)
    if (isAdmin()) {
      return <>{children}</>;
    } else {
      // Redirect to dashboard if not admin
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }
  }

  // Standard authorization for non-admin routes
  if (!currentUser) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized(currentUser.role, requiredRole)) {
    // Redirect to dashboard if not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Helper function to check authorization
function isAuthorized(userRole: string, requiredRole: string): boolean {
  if (userRole === 'admin') return true;
  if (userRole === 'manager' && requiredRole !== 'admin') return true;
  if (userRole === 'viewer' && requiredRole === 'viewer') return true;
  return false;
}
