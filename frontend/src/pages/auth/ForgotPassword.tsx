import { Link } from "react-router-dom";

import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Forgot password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we'll send you a 6-digit reset code.
        </p>

        <div className="mt-6">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Remembered your password?{" "}

          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
