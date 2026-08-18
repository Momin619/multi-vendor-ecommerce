import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
}

/**
 * Reusable application button.
 */
const Button = ({
  children,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className="flex cursor-pointer w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;