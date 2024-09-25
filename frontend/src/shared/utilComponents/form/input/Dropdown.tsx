import {
  Autocomplete,
  FormControl,
  TextField,
} from "@mui/material";
import { IPostAdminData } from "models/admin/IPostAdminData";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";

interface DropdownProps {
  name: string;
  dropdownData: string[] | IPostAdminData[];
  required?: boolean;
  multiple?: boolean;
  customInput?: boolean;
  placeholder?: string;
  label?: string;
  onChange?: (e: React.SyntheticEvent, value: any) => void; // Updated onChange signature
}

export const Dropdown: React.FC<DropdownProps> = ({
  required,
  name,
  dropdownData,
  multiple,
  customInput,
  label,
  onChange,
}) => {
  return (
    <FormControl fullWidth>
      <Autocomplete
        disablePortal
        multiple={multiple} // Enable multi-selection if the `multiple` prop is true
        options={dropdownData as (string | IPostAdminData)[]}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option._id
        }
        onChange={onChange} // Use the correct onChange handler
        renderOption={(props, option) => (
          <li {...props}>
            {typeof option === "string"
              ? formatWord(option)
              : formatWord(option.name_of_the_post)}
          </li>
        )}
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
