import {
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
  useAuth,
} from "../../hooks/useAuth";

const Login = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * If already authenticated,
   * don't show login form.
   */
  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Login to your account
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;