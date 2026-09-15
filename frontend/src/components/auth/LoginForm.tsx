import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useRedirect } from "../../hooks/useRedirect";
import { getErrorMessage } from "../../api/error.utils";
import toast from "react-hot-toast";
import type { LoginData } from "../../types/auth.types";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface LoginLocationState {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
}

const LoginForm = () => {
  const { login } = useAuth();
  const { redirectTo } = useRedirect();
  const location = useLocation();

  const state =
    location.state as LoginLocationState | null;

  const from = state?.from;

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      const loggedInUser = await login(data);

      const destination = from?.pathname
        ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
        : `/dashboard/${loggedInUser.role}`;

      redirectTo(destination, true);
    } catch (error) {
  toast.error(getErrorMessage(error));
}
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register("email", {
          required: "Email is required",
        })}
        error={errors.email?.message}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        {...register("password", {
          required: "Password is required",
        })}
        error={errors.password?.message}
      />

      <div className="flex justify-end">
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-accent hover:underline"
        >
          Forgot password?
        </Link>
      </div>

     <div className="flex justify-center">
  <Button
    type="submit"
    isLoading={isSubmitting}
    className="sm:w-40"
  >
    Login
  </Button>
</div>
    </form>
  );
};

export default LoginForm;