import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAuth } from "../../hooks/useAuth";
import { useRedirect } from "../../hooks/useRedirect";
import { getErrorMessage } from "../../api/error.utils";

import type { RegisterData } from "../../types/auth.types";

import Button from "../ui/Button";
import Input from "../ui/Input";

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const { redirectTo } = useRedirect();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterData>({
    defaultValues: {
      role: "customer",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerUser(data);

      toast.success("Registered successfully.");

      redirectTo("/login", true);
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
        id="name"
        label="Name"
        type="text"
        placeholder="Your name"
        {...register("name", {
          required: "Name is required",
          minLength: {
            value: 2,
            message: "Name must contain at least 2 characters",
          },
        })}
        error={errors.name?.message}
      />

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
          minLength: {
            value: 8,
            message: "Password must contain at least 8 characters",
          },
        })}
        error={errors.password?.message}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">
          Account type
        </p>

        <div className="grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer rounded-lg border p-3 text-center ${
              selectedRole === "customer"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="customer"
              className="sr-only"
              {...register("role", {
                required: "Please select a role",
              })}
            />
            Customer
          </label>

          <label
            className={`cursor-pointer rounded-lg border p-3 text-center ${
              selectedRole === "seller"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              value="seller"
              className="sr-only"
              {...register("role", {
                required: "Please select a role",
              })}
            />
            Seller
          </label>
        </div>

        {errors.role?.message && (
          <p className="mt-1 text-sm text-red-600">
            {errors.role.message}
          </p>
        )}
      </div>

      {errors.root?.message && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        isLoading={isSubmitting}
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;