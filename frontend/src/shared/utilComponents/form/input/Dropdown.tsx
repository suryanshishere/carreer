import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { InputProps } from "./Input";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";
import { useState } from "react";
import { IPostAdminData } from "models/admin/IPostAdminData";

interface DropdownProps {
  name: string;
  dropdownData: string[] | IPostAdminData[];
  required?: boolean;
  multiple?: boolean;
  customInput?: boolean;
  placeholder?: string;
  label?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  required,
  name,
  dropdownData,
  multiple,
  customInput,
  label,
}) => {
  // if (!dropdownData) return <p>No dropdown data available</p>;

  // Custom input, search, and multi-select
  if (multiple && customInput) {
  }

  // Custom input, search, and select
  if (customInput) {
  }

  // Default search and multi-select
  if (multiple) {
  }

  // Default search and select
  return (
    <FormControl fullWidth>
      <Autocomplete
        disablePortal
        options={dropdownData as (string | IPostAdminData)[]}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option._id
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ? formatWord(label) : formatWord(name)}
            name={name}
            required={required}
          />
        )}
      />
    </FormControl>
  );
};
