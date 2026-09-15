import { Link } from "react-router-dom";

import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-md rounded-md border border-border bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Reset password
        </h1>

        <p className="mt-2 text-sm text-ink-soft">
          Enter the code we emailed you along with your new password.
        </p>

        <div className="mt-6">
          <ResetPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Didn't get a code?{" "}

          <Link
            to="/forgot-password"
            className="font-medium text-accent hover:underline"
          >
            Request a new one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
