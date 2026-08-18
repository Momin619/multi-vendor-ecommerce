import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  useAuth,
} from "../hooks/useAuth";

import LoadingSpinner from "../components/ui/LoadingSpinner";

/**
 * Protects routes that require authentication.
 *
 * It does NOT check roles.
 *
 * Role checking is handled separately by RoleRoute.
 */
const ProtectedRoute = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const location = useLocation();

  /**
   * Don't redirect anywhere while authentication
   * is still being restored.
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * Authentication restoration is complete.
   *
   * Only now are we allowed to decide whether
   * the user should be redirected.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return <Outlet />;
};
export default ProtectedRoute;