import {
  Link,
  Navigate,
} from "react-router-dom";

import RegisterForm from "../../components/auth/RegisterForm";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";

const Register = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Get started buying or selling on Market Ledger
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-accent hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;