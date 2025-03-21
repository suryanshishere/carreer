import { startCase } from "lodash";
import React, { useState, ChangeEvent, CSSProperties, forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string | boolean;
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
  className?: string;
  outerClassProp?: string;
  errorClassProp?: string;
  maxHeight?: number;
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
      className,
      outerClassProp,
      errorClassProp,
    },
    ref
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
            className="p-0 hover:text-custom_red absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-custom_gray"
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
      <div className={`${outerClassProp ?? ""} flex flex-col`}>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {typeof label === "string" ? startCase(label) : startCase(name)}
          </label>
        )}
        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={name}
            name={name}
            type={showPassword && type === "password" ? "text" : type}
            required={required}
            placeholder={placeholder || startCase(name)}
            value={value}
            onChange={onChange}
            className={`w-full pl-2 py-2 outline outline-2 focus:outline-custom_gray outline-custom_less_gray text-base rounded ${className} ${
              error ? "outline-custom_red" : ""
            } ${error ? "focus:ring-custom_red" : "focus:ring-custom_less_gray"}
            `}
            style={style}
          />
          {endAdornment && (
            <div className="absolute right-1 flex items-center h-full">
              {endAdornment}
            </div>
          )}
        </div>
        {helperText && (
          <p
            className={`ml-2 mt-[2px] text-xs w-auto whitespace-nowrap ${
              error ? "text-custom_red" : "hidden"
            } ${errorClassProp}`}
          >
            {helperText.replace(/_/g, " ")}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

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
      className,
      outerClassProp,
      errorClassProp,
      label,
      maxHeight = 300, 
    },
    ref
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const [height, setHeight] = useState<string>("auto");

    React.useEffect(() => {
      if (textAreaRef.current) {
        setHeight("auto"); // Reset before recalculating
        const newHeight = textAreaRef.current.scrollHeight;
        setHeight(`${Math.min(newHeight, maxHeight)}px`); // Limit height
      }
    }, [value]); // Recalculate on value change

    return (
      <div className={`relative ${outerClassProp || ""}`}>
        {label && (
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {typeof label === "string" ? startCase(label) : startCase(name)}
          </label>
        )}
        <textarea
          placeholder={placeholder}
          ref={(el) => {
            if (ref) {
              if (typeof ref === "function") ref(el);
              else ref.current = el;
            }
            textAreaRef.current = el;
          }}
          id={name}
          name={name}
          rows={row}
          required={required}
          disabled={disabled}
          value={value}
          onChange={(e) => {
            if (onChange) onChange(e);
            setHeight("auto"); // Reset before recalculating
            const newHeight = e.target.scrollHeight;
            setHeight(`${Math.min(newHeight, maxHeight)}px`); // Limit height
          }}
          className={`w-full pl-2 py-2 outline outline-2 outline-custom_less_gray text-base rounded ${className} ${
            error ? "outline-custom_red" : ""
          } ${error ? "focus:ring-custom_red" : "focus:ring-custom_less_gray"}`}
          style={{
            height,
            maxHeight: `${maxHeight}px`, // Apply max height
            overflowY: height === `${maxHeight}px` ? "auto" : "hidden", // Show scrollbar only at max height
          }}
        />
        {helperText && (
          <p
            className={`ml-2 mt-[2px] text-xs w-auto whitespace-nowrap ${
              error ? "text-custom_red" : "hidden"
            } ${errorClassProp}`}
          >
            {helperText.replace(/_/g, " ")}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
