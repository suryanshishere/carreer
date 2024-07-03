import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";

interface SimpleDropdownProps {
  required?: boolean;
  name: string;
  categoryData: string[];
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  required,
  name,
  categoryData,
}) => {
  const [value, setValue] = useState<string>("");

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value as string);
  };

  return (
    <FormControl>
      <InputLabel required={required}>{name}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={name} />}
        inputProps={{
          sx: {
            height: "1.5rem",
            fontSize: "var(--font-size)",
            fontWeight: "bold",
          },
        }}
      >
        {categoryData?.map((data, index) => (
          <MenuItem
            key={index}
            value={data}
            sx={{
              fontSize: "var(--font-size)",
              margin: "0px 6px",
              marginBottom: "4px",
              borderRadius: "var(--border-radius)",
            }}
          >
            {data}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SimpleDropdown;
