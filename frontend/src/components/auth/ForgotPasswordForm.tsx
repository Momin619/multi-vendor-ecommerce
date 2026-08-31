import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { forgotPassword } from "../../api/auth.api";
import { getErrorMessage } from "../../api/error.utils";
import { useRedirect } from "../../hooks/useRedirect";

import type { ForgotPasswordData } from "../../types/auth.types";

import Button from "../ui/Button";
import Input from "../ui/Input";

const ForgotPasswordForm = () => {
  const { redirectTo } = useRedirect();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordData>();

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const response = await forgotPassword(data);

      toast.success(response.message);

      /**
       * Carry the email over as a query param so the next page
       * can prefill it instead of asking the user to retype it.
       */
      redirectTo(
        `/reset-password?email=${encodeURIComponent(data.email)}`,
      );
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

      <div className="flex justify-center">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="sm:w-48"
        >
          Send reset code
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
