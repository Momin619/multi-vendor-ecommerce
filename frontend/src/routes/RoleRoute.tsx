import {
  Navigate,
  Outlet,
} from "react-router-dom";

import type {
  UserRole,
} from "../types/user.types";

import {
  useAuth,
} from "../hooks/useAuth";

import LoadingSpinner from "../components/ui/LoadingSpinner";

interface RoleRouteProps {
  allowedRole: UserRole;
}

/**
 * Protects routes by role.
 *
 * - Not logged in            -> /login
 * - Logged in, wrong role    -> their own dashboard
 * - Logged in, correct role  -> render the page
 */
const RoleRoute = ({ allowedRole }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return (
      <Navigate
        to={user.role === "seller" ? "/seller/dashboard" : "/customer/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

export default RoleRoute;