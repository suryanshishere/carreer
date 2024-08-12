import { InputProps } from "./Input";

export const Dropdown: React.FC<InputProps> = ({
  required,
  name,
  // dropdownData,
  multiple,
  customInput,
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
  return null;
};
