import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

interface SimpleDropdownWithCustomProps {
  required?: boolean;
  name: string;
  detailCategoryData: { code: string }[];
}

const SimpleDropdownWithCustom: React.FC<SimpleDropdownWithCustomProps> = ({
  required,
  name,
  detailCategoryData,
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
        {detailCategoryData?.map((data, index) => (
          <MenuItem
            key={index}
            value={data.code}
            sx={{
              fontSize: "var(--font-size)",
              margin: "0px 6px",
              marginBottom: "4px",
              borderRadius: "var(--border-radius)",
            }}
          >
            <Typography
              sx={{
                fontWeight: "regular",
              }}
            >
              {data.code}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SimpleDropdownWithCustom;
