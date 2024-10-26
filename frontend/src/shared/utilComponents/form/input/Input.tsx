import React, { useState, ChangeEvent, CSSProperties, forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  style?: CSSProperties;
  row?: number;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  type?: string;
  classProp?: string;
}

// Forward ref to Input component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      placeholder,
      required,
      type,
      style,
      value,
      onChange,
      error,
      helperText,
      classProp,
    },
    ref // Accept ref here
  ) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const endAdornment = (() => {
      if (type === "password") {
        return (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        );
      } else if (type === "search") {
        return (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        );
      }
      return null;
    })();

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {label || placeholder || name}
          </label>
        )}
        <input
          ref={ref} // Use inputRef instead of ref
          id={name}
          name={name}
          type={showPassword && type === "password" ? "text" : type}
          required={required}
          placeholder={placeholder || name}
          value={value}
          onChange={onChange}
          className={`w-full pl-2 py-1 border-2 border-custom-less-grey rounded-md ${classProp} ${
            error ? "border-custom-red" : ""
          }  ${
            error ? "focus:ring-custom-red" : "focus:ring-custom-less-grey"
          }`}
          style={style}
        />
        {endAdornment}
        {helperText && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-custom-red-500" : "text-gray-500"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; // Optional: Set display name for better debugging

// TextArea Component
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  Omit<InputProps, "onChange"> & {
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  }
>(
  (
    {
      name,
      required,
      value,
      onChange,
      row = 4,
      placeholder,
      disabled = false,
      error,
      helperText,classProp
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {placeholder || name}
        </label>
        <textarea
          ref={ref} // Now specific to HTMLTextAreaElement
          id={name}
          name={name}
          rows={row}
          required={required}
          disabled={disabled}
          value={value}
          onChange={onChange} // Now specific to HTMLTextAreaElement
          className={`w-full pl-2 border-2 border-custom-less-grey rounded-md ${classProp} ${
            error ? "border-custom-red" : ""
          }  ${
            error ? "focus:ring-custom-red" : "focus:ring-custom-less-grey"
          }`}
        />
        {helperText && (
          <p
            className={`mt-1 text-sm ${
              error ? "text-custom-red" : "text-custom-grey"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; // Optional: Set display name for better debugging
