import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { isAuthenticated, getUserRole } from "./sessionManager";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate({ to: "/login" });
      return;
    }

    if (requiredRole) {
      const userRole = getUserRole();
      if (userRole !== requiredRole) {
        // Redirect to unauthorized or home
        navigate({ to: "/login" });
      }
    }
  }, [navigate, requiredRole]);

  if (!isAuthenticated()) {
    return null;
  }

  if (requiredRole && getUserRole() !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};
