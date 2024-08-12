import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  SelectChangeEvent,
  useTheme,
  Theme,
  Typography,
} from "@mui/material";

interface MultipleSelectDropdownWithCustomProps {
  required?: boolean;
  name: string;
  detailCategoryData: { code: string }[];
}

const MultipleSelectDropdownWithCustom: React.FC<MultipleSelectDropdownWithCustomProps> = ({
  required,
  name,
  detailCategoryData,
}) => {
  const theme = useTheme();
  const [personName, setPersonName] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const getStyles = (name: string, personName: string[], theme: Theme) => {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  return (
    <FormControl>
      <InputLabel required={required}>{name}</InputLabel>
      <Select
        multiple
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput label={name} />}
        required={required}
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
            style={getStyles(data.code, personName, theme)}
            sx={{
              fontSize: "var(--font-size)",
              margin: "0px 6px",
              marginBottom: "4px",
              borderRadius: "var(--border-radius)",
            }}
          >
            <Typography
              sx={{
                fontWeight:
                  personName.indexOf(data.code) === -1
                    ? "regular"
                    : "bold",
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

export default MultipleSelectDropdownWithCustom;
