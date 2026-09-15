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
        className="block text-sm font-medium text-ink"
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
          rounded-md
          border
          border-border
          bg-surface
          px-3
          py-2.5
          text-sm
          text-ink
          outline-none
          transition
          placeholder:text-ink-soft/60
          focus:border-accent
          focus:ring-2
          focus:ring-accent-soft
          disabled:cursor-not-allowed
          disabled:bg-paper
          sm:text-base
          ${className}
        `}
      />

      {error && (
        <p className="break-words text-xs text-danger sm:text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;