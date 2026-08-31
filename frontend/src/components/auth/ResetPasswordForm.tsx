import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

import { resetPassword } from "../../api/auth.api";
import { getErrorMessage } from "../../api/error.utils";
import { useRedirect } from "../../hooks/useRedirect";

import type { ResetPasswordData } from "../../types/auth.types";

import Button from "../ui/Button";
import Input from "../ui/Input";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const { redirectTo } = useRedirect();

  /**
   * Prefill the email if the user arrived here from the
   * forgot-password form.
   */
  const emailFromQuery = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordData>({
    defaultValues: {
      email: emailFromQuery,
    },
  });

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const response = await resetPassword(data);

      toast.success(response.message);
      redirectTo("/login", true);
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
        id="otp"
        label="Reset code"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="123456"
        {...register("otp", {
          required: "Reset code is required",
          minLength: {
            value: 6,
            message: "Reset code must be 6 digits",
          },
          maxLength: {
            value: 6,
            message: "Reset code must be 6 digits",
          },
        })}
        error={errors.otp?.message}
      />

      <Input
        id="newPassword"
        label="New password"
        type="password"
        placeholder="••••••••"
        {...register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 8,
            message: "Password must contain at least 8 characters",
          },
        })}
        error={errors.newPassword?.message}
      />

      <div className="flex justify-center">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="sm:w-48"
        >
          Reset password
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
