import type {
  InputHTMLAttributes,
} from "react";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) => {
  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className="
          block
          text-sm
          font-medium
          text-gray-700
        "
      >
        {label}
      </label>

      <input
        id={id}
        {...props}
        className={`
          block
          w-full
          min-w-0
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2.5
          text-sm
          text-gray-900
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          sm:text-base
          ${className}
        `}
      />

      {error && (
        <p className="break-words text-xs text-red-600 sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;