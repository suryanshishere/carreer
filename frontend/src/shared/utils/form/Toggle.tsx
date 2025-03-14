import React from "react";
import Tooltip from "@mui/material/Tooltip";

export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tooltip?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Optional class names for additional customization
  labelClassName?: string;
  dotClassName?: string;
  dotActiveClassName?:string;
  label?:string;
}

const Toggle: React.FC<ToggleProps> = ({
  tooltip,
  checked,
  onChange,
  labelClassName = "",
  dotClassName="",
  dotActiveClassName ="",
  label,
  ...rest
}) => {
  const toggleLabel = (
    <label className={`relative min-w-14 h-6 float-right flex cursor-pointer select-none items-center ${labelClassName}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...rest}
      />
      <div
        className={`h-full w-full rounded-full transition text-xs font-bold flex items-center justify-center text-custom_black whitespace-nowrap ${
          checked ? "bg-custom_less_blue" : "bg-custom_less_gray"
        }`}
      >
        {!checked && <span className="ml-5 pr-1">{label}</span>}
      </div>
      <div
        className={`dot absolute top-[4px] mx-1 h-4 w-4 rounded-full transition-transform ${
          checked
            ? `${dotActiveClassName} bg-custom_blue`
            : "translate-x-0 bg-custom_gray"
        } ${dotClassName}`}
      ></div>
    </label>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {toggleLabel}
    </Tooltip>
  ) : (
    toggleLabel
  );
};

export default Toggle;
