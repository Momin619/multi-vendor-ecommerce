import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children?: ReactNode;
}

const Button = ({
  children,
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex
        w-full
        items-center
        justify-center
        cursor-pointer
        gap-2
        rounded-md
        bg-accent
        px-4
        py-2.5
        text-sm
        font-medium
        text-accent-ink
        transition
        hover:bg-accent-dark
        focus:outline-none
        focus:ring-2
        focus:ring-accent
        focus:ring-offset-1
        focus:ring-offset-paper
        disabled:cursor-not-allowed
        disabled:opacity-60
        sm:w-auto
        ${className}
      `}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default Button;