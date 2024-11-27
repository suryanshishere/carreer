import React, { forwardRef } from "react"; 
import { Autocomplete, FormControl, TextField } from "@mui/material";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { startCase } from "lodash";

interface IDropdown {
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
  )=>void; 
  error?: boolean; 
  helperText?: string; 
  register?: any; // Make register optional
}

// Wrap the component in forwardRef
export const Dropdown = forwardRef<HTMLDivElement, IDropdown>(({
    required,
    name,
    dropdownData,
    multiple,
    label,
    onChange,
    error,
    helperText,
    register, // Accept register as a prop
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
          typeof option === "string" ? option :  option._id 
        }
        onChange={onChange}
        renderOption={(props, option) => {
          const { key, ...restProps } = props;
          return (
            <li key={key} {...restProps}>
              {typeof option === "string"
                ? startCase(option)
                : startCase(option.name_of_the_post)}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ? startCase(label) : startCase(name)}
            name={name}
            required={required}
            error={error}
            helperText={error ? helperText : undefined}
            {...(register ? register(name) : {})} // Only register if it's provided
          />
        )}
      />
    </FormControl>
  );
});

// Optional: Set a display name for better debugging
Dropdown.displayName = 'Dropdown';
