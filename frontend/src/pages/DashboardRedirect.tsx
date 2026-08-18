import {
  Navigate,
} from "react-router-dom";

import {
  useAuth,
} from "../hooks/useAuth";

import LoadingSpinner from "../components/ui/LoadingSpinner";

/**
 * Redirects the authenticated user to the
 * dashboard belonging to their role.
 */
const DashboardRedirect = () => {
  const {
    user,
    isLoading,
  } = useAuth();

  /**
   * Wait for AuthContext to restore the session.
   */
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * This route is already protected by
   * ProtectedRoute, but this is an additional
   * safety check.
   */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /**
   * Send seller to seller dashboard.
   */
  if (user.role === "seller") {
    return (
      <Navigate
        to="/seller/dashboard"
        replace
      />
    );
  }

  /**
   * Send customer to customer dashboard.
   */
  if (user.role === "customer") {
    return (
      <Navigate
        to="/customer/dashboard"
        replace
      />
    );
  }

  /**
   * Safety fallback.
   */
  return (
    <Navigate
      to="/login"
      replace
    />
  );
};

export default DashboardRedirect;