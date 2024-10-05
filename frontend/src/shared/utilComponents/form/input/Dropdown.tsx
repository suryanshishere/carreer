import React, { forwardRef } from 'react'; 
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";

interface DropdownProps {
  name: string;
  dropdownData: string[] | IPostAdminData[];
  required?: boolean;
  multiple?: boolean;
  label?: string;
  onChange?: (
    e: React.SyntheticEvent,
    value: string | IPostAdminData | (string | IPostAdminData)[] | null,
    reason: string,
    details?: { option?: string | IPostAdminData }
  ) => void; 
  error?: boolean; 
  helperText?: string; 
}

// Wrap the component in forwardRef
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
    required,
    name,
    dropdownData,
    multiple,
    label,
    onChange,
    error,
    helperText,
  },
  ref
) => {
  return (
    <FormControl fullWidth ref={ref} error={error}> 
      <Autocomplete
        disablePortal
        multiple={multiple} 
        options={dropdownData as (string | IPostAdminData)[]}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name_of_the_post || option._id 
        }
        onChange={(event, value) => {
          // Call the onChange handler passed from the parent component
          if (onChange) {
            onChange(event, value ?? null, "select-option"); // Pass null if value is null
          }
        }}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <li key={key} {...restProps}>
              {typeof option === "string"
                ? formatWord(option)
                : formatWord(option.name_of_the_post)}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ? formatWord(label) : formatWord(name)}
            name={name}
            required={required}
            error={error}
            helperText={error ? helperText : undefined}
          />
        )}
      />
    </FormControl>
  );
});

// Optional: Set a display name for better debugging
Dropdown.displayName = 'Dropdown';
