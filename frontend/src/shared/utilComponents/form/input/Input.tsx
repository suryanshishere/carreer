import React, { useState, ChangeEvent, CSSProperties } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import "./Input.css";

export const InputStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--hover-color)",
      borderWidth: "2px",
      borderRadius: "var(--border-radius)",
      fontSize: "var(--font-size)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
      borderWidth: "2px",
    },
  },
  "& .MuiFormLabel-root": {
    color: "var(--color-gray)",
    fontWeight: "bold",
  },
  "& .Mui-focused.MuiInputLabel-root": {
    color: "var(--color-black)",
    fontWeight: "bold",
  },
};

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  // className?: string;
  style?: CSSProperties;
  row?: number;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  required,
  type,
  style,
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const endAdornment = (() => {
    if (type === 'password') {
      // Show password toggle button for password type
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
    } else if (type === 'search') {
      // Show search icon for search type
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
    <TextField
      name={name}
      type={showPassword && type === "password" ? "text" : type}
      required={required}
      label={placeholder === "" ? null : placeholder || formatWord(name)}
      value={value}
      onChange={onChange}
      variant="outlined"
      fullWidth
      inputProps={{
        sx: {
          height: "1rem",
          fontSize: "var(--font-size)",
          fontWeight: "bold",
          ...style,
        },
      }}
      InputProps={{
        endAdornment
      }}
    />
  );
};

export const TextArea: React.FC<InputProps> = ({
  name,
  required,
  value,
  onChange,
  row,
  placeholder,
}) => {
  return (
    <TextField
      id="outlined-multiline-flexible"
      label={placeholder || formatWord(name)}
      multiline
      maxRows={row}
      name={name}
      onChange={onChange}
      value={value}
      required={required}
      InputProps={{
        sx: {
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          minHeight: "7rem",
          fontSize: "var(--font-size)",
          fontWeight: "bold",
        },
      }}
      sx={InputStyle}
    />
  );
};

export const Date: React.FC<InputProps> = ({ name, required }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={formatWord(name)}
          name={name}
          slotProps={{
            textField: {
              required: required,
            },
          }}
          sx={{
            ...InputStyle,
            "& input": {
              height: "1.5rem",
              fontSize: "var(--font-size)",
              fontWeight: "bold",
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};
