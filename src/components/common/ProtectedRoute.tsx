
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'viewer';
}

export function ProtectedRoute({ children, requiredRole = 'viewer' }: ProtectedRouteProps) {
  const { currentUser, isAuthorized } = useUser();
  const location = useLocation();

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
