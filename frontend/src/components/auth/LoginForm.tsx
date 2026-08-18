import {
  useForm,
} from "react-hook-form";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../hooks/useAuth";

import {
  getErrorMessage,
} from "../../api/error.utils";

import type {
  LoginData,
} from "../../types/auth.types";

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
  const {
    login,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as
      | LoginLocationState
      | null;

  const from = state?.from;

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginData>();

  const onSubmit = async (
    data: LoginData,
  ) => {
    try {
      await login(data);

      /**
       * If the user originally requested
       * a protected page, return there.
       *
       * Otherwise use /dashboard.
       */
      const destination =
        from?.pathname
          ? `${from.pathname}${from.search ?? ""}${from.hash ?? ""}`
          : "/dashboard";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      setError("root", {
        message: getErrorMessage(error),
      });
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

      {errors.root?.message && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;