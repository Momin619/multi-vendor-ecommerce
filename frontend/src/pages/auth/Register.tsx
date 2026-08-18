import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import {
  toast,
} from "react-hot-toast";

import RegisterForm from "../../components/auth/RegisterForm";
import { useAuth } from "../../hooks/useAuth";

/**
 * Registration page.
 */
const Register = () => {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      toast.success("You are already logged in.");
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
  ]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-gray-900">
          Create Account
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create your account to get started
        </p>

        <div className="mt-6">
          <RegisterForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
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

export default Register;