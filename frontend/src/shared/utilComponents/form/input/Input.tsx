import React, { useState, ChangeEvent, CSSProperties, forwardRef } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./Input.css";



export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  style?: CSSProperties;
  row?: number;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean; // Added error prop for validation
  helperText?: string; // Added for helper text
  disabled?: boolean;
  type?: string;
}

// Forward ref to Input component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
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
          <InputAdornment position="end">
            <IconButton
              type="button"
              size="small"
              onClick={togglePasswordVisibility}
              className="hover:cursor-default"
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </IconButton>
          </InputAdornment>
        );
      } else if (type === "search") {
        return (
          <InputAdornment position="end">
            <IconButton
              type="button"
              size="small"
              className="hover:cursor-default"
            >
              <SearchOutlinedIcon />
            </IconButton>
          </InputAdornment>
        );
      }
      return null;
    })();

    return (
      <>
        <TextField
          inputRef={ref} // Use inputRef instead of ref
          name={name}
          type={showPassword && type === "password" ? "text" : type}
          required={required}
          label={placeholder === "" ? null : placeholder || formatWord(name)}
          value={value}
          onChange={onChange}
          variant="outlined"
          fullWidth
          error={error} // Set error state
          helperText={helperText} // Display helper text
          InputProps={{
            endAdornment,
          }}
        />
      </>
    );
  }
);

Input.displayName = "Input"; // Optional: Set display name for better debugging

// TextArea Component
export const TextArea: React.FC<InputProps> = forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      name,
      required,
      value,
      onChange,
      row,
      placeholder,
      disabled = false,
      type,
      error,
      helperText,
    },
    ref // Accept ref here
  ) => {
    if (type === "number") {
      return (
        <Input
          type={type}
          name={name}
          onChange={onChange}
          value={value}
          required={required}
          ref={ref}
          label={placeholder || formatWord(name)}
          disabled={disabled}
          error={error} 
          helperText={helperText} 
        />
      );
    }
    return (
      <TextField
        label={placeholder || formatWord(name)}
        disabled={disabled}
        multiline
        maxRows={row}
        name={name}
        onChange={onChange}
        value={value}
        required={required}
        inputRef={ref} 
        fullWidth
        error={error} 
        helperText={helperText} 
      />
    );
  }
);

TextArea.displayName = "TextArea"; // Optional: Set display name for better debugging

// Date Component
export const Date: React.FC<InputProps> = forwardRef<
  HTMLInputElement,
  InputProps
>(({ name, required }, ref) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={formatWord(name)}
          name={name}
          slotProps={{
            textField: {
              required: required,
              inputRef: ref, // Pass ref to the text field
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
});

Date.displayName = "Date"; // Optional: Set display name for better debugging
