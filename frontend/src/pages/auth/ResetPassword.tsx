import { Link } from "react-router-dom";

import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Reset password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the code we emailed you along with your new password.
        </p>

        <div className="mt-6">
          <ResetPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Didn't get a code?{" "}

          <Link
            to="/forgot-password"
            className="font-medium text-blue-600 hover:underline"
          >
            Request a new one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
