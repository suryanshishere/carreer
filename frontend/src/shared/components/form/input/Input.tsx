import React, { useState, ChangeEvent } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { formatWord } from "shared/helpers/format-word";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton, TextField } from "@mui/material";
import { CodeItem } from "models/admin/AdminExamProps";
import Button from "../Button";
import "./Input.css";

export const InputStyle = {
  width: "100%",
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
  togglePassword?: boolean;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  className?: string;
  textAreaClassName?: string;
  row?: number;
  minHeight?: string;
  customInput?: boolean;
  multiple?: boolean;
  dropdownData?: CodeItem[];
}

export const Input: React.FC<InputProps> = ({
  name,
  togglePassword,
  value,
  onChange,
  required,
  type,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      {togglePassword ? (
        <div className="w-full flex items-center justify-end">
          <TextField
            className="w-full"
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            required={required}
            label={formatWord(name)}
            id="outlined-basic"
            variant="outlined"
            inputProps={{
              sx: {
                height: "1.5rem",
                fontSize: "var(--font-size)",
                fontWeight: "bold",
              },
            }}
            sx={InputStyle}
          />
          <div className="absolute mt-1 mr-3">
            <IconButton
              type="button"
              size="small"
              onClick={togglePasswordVisibility}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  cursor: "default !important",
                },
              }}
            >
              {showPassword ? (
                <VisibilityOffOutlinedIcon />
              ) : (
                <VisibilityOutlinedIcon />
              )}
            </IconButton>
          </div>
        </div>
      ) : (
        <TextField
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          label={formatWord(name)}
          id="outlined-basic"
          variant="outlined"
          inputProps={{
            sx: {
              height: "1.5rem",
              fontSize: "var(--font-size)",
              fontWeight: "bold",
            },
          }}
          sx={InputStyle}
        />
      )}
    </>
  );
};

export const TextArea: React.FC<InputProps> = ({
  name,
  required,
  value,
  onChange,
  row,
  minHeight,
}) => {
  return (
    <TextField
      id="outlined-multiline-flexible"
      label={formatWord(name)}
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
          minHeight: minHeight || "7rem",
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

// Todo
export const AddInput: React.FC<InputProps> = ({ name, required }) => {
  const [inputList, setInputList] = useState<string[]>([]);
  const [newInputName, setNewInputName] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewInputName(event.target.value);
  };

  const handleAddInput = () => {
    if (newInputName.trim() !== "") {
      setInputList([...inputList, newInputName]);
      setNewInputName("");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newInputName}
          onChange={handleInputChange}
          placeholder="Enter input name"
        />
        <Button type="button" onClick={handleAddInput}>
          Add Input
        </Button>
      </div>
      <div>
        {inputList.map((inputName, index) => (
          <div key={index}>
            <input type="text" name={inputName} required={required} />
          </div>
        ))}
      </div>
    </div>
  );
};
