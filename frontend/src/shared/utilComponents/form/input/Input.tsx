import React, { useState, ChangeEvent, CSSProperties, forwardRef } from "react";
import Button from "../Button";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";

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
  outerClassProp?: string;
  errorClassProp?:string;
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
      outerClassProp,
      errorClassProp,
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
          <Button
            type="button"
            style={{ cursor: "default" }}
            classProp="cursor-default p-0 hover:text-custom-red absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-custom-grey"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
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
      <div className={`${outerClassProp}`}>
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
            placeholder={placeholder || formatWord(name)}
            value={value}
            onChange={onChange}
            className={`w-full pl-2 py-2 border-2 border-custom-grey text-base rounded ${classProp} ${
              error ? "border-custom-red" : ""
            }  ${
              error ? "focus:ring-custom-red" : "focus:ring-custom-less-grey"
            }`}
            style={style}
          />
          {endAdornment}
        </div>
        {helperText && (
          <p
            className={`ml-2 mt-0 bg-custom-white text-xs w-auto whitespace-nowrap ${
              error ? "text-custom-red" : "text-grey"
            } ${errorClassProp}`}
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
      helperText,
      classProp,
      outerClassProp,
    },
    ref
  ) => {
    return (
      <div className={`relative ${outerClassProp}`}>
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
            className={`ml-2 text-sm ${
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
