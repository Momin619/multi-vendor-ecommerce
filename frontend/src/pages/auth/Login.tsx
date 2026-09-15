import {
  Link,
  Navigate,
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
    user
  } = useAuth();


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * If already authenticated,
   * don't show login form.
   */
if (isAuthenticated && user) {
  return (
    <Navigate
      to={`/dashboard/${user.role}`}
      replace
    />
  );
}

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Log in to your account
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Don't have an account?{" "}

          <Link
            to="/register"
            className="font-medium text-accent hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;