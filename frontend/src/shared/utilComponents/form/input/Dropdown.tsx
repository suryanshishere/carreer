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

  const [data, setData] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setData(event.target.value as string);
  };

  // Default search and select
  return (
    <FormControl fullWidth>
      {/* <InputLabel id={`${name}-select-label`}>{formatWord(label || name)}</InputLabel>
      <Select
        labelId={`${name}-select-label`}
        name={name}
        value={data}
        label={formatWord(label || name)}
        onChange={handleChange}
      >
        {Array.isArray(dropdownData) &&
          dropdownData.map((item) => {
            if (typeof item === "string") {
              return (
                <MenuItem key={item} value={item}>
                  {formatWord(item)}
                </MenuItem>
              );
            } else if (
              typeof item === "object" &&
              item !== null &&
              "_id" in item
            ) {
              return (
                <MenuItem key={item._id} value={item._id}>
                  {item.title}
                </MenuItem>
              );
            } else {
              return null;
            }
          })}
      </Select> */}
      <Autocomplete
        disablePortal
        options={dropdownData as (string | IPostAdminData)[]}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? formatWord(option)
            : formatWord(option.data.name_of_the_post)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label ? formatWord(label) : formatWord(name)}
            name={name}
          />
        )}
      />
    </FormControl>
  );
};
