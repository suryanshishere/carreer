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
      helperText, // Accept helper text
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
          className={`w-full p-2 border ${
            error ? "border-custom-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? "focus:ring-custom-red-500" : "focus:ring-blue-500"
          }`}
          style={style}
        />
        {endAdornment}
        {helperText && (
          <p className={`mt-1 text-sm ${error ? "text-custom-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input"; // Optional: Set display name for better debugging

// TextArea Component
export const TextArea = forwardRef<HTMLTextAreaElement, Omit<InputProps, "onChange"> & {
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}>(
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
      helperText,
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
          className={`w-full p-2 border ${
            error ? "border-custom-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 ${
            error ? "focus:ring-custom-red-500" : "focus:ring-blue-500"
          }`}
        />
        {helperText && (
          <p className={`mt-1 text-sm ${error ? "text-custom-red-500" : "text-gray-500"}`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea"; // Optional: Set display name for better debugging
