
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'viewer';
}

export function ProtectedRoute({ children, requiredRole = 'viewer' }: ProtectedRouteProps) {
  const { currentUser, isAuthorized, isAdmin } = useUser();
  const location = useLocation();

  // Special case for admin route
  if (requiredRole === 'admin') {
    // Allow access if user is admin or adminAuth is set in localStorage
    if (isAdmin()) {
      return <>{children}</>;
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // Standard authorization for non-admin routes
  if (!currentUser) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthorized(requiredRole)) {
    // Redirect to dashboard if not authorized
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
