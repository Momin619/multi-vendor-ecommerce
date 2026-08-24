import type { TextareaHTMLAttributes } from "react";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextArea = ({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) => {
  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <textarea
        id={id}
        {...props}
        className={`
          block
          w-full
          min-w-0
          resize-y
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

export default TextArea;