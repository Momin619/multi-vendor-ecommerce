import { Link } from "react-router-dom";

import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Forgot password
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Enter your email and we'll send you a 6-digit reset code.
        </p>

        <div className="mt-6">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Remembered your password?{" "}

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

export default ForgotPassword;
