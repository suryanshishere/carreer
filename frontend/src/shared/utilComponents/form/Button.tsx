import React, { ButtonHTMLAttributes } from "react";
import { IconButton, Button as MaterialButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import "./Button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  noOutline?: boolean;
  href?: string;
  size?: "small" | "medium" | "large";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  tick,
  type,
  onClick,
  noOutline,
  href,
  size,
  ...props
}) => {
  if (noOutline) {
    return (
      <MaterialButton
        onClick={onClick}
        className={className}
        href={href}
        sx={{
          borderRadius: "var(--border-radius)",
          marginRight: ".5rem",
          color: "var(--color-brown)",
          textTransform: "capitalize",
          "&:hover": {
            backgroundColor: "none",
          },
        }}
      >
        {children}
      </MaterialButton>
    );
  }

  if (tick) {
    return (
      <IconButton
        onClick={onClick}
        type={type ? type : "submit"}
        className={className}
        size={size}
      >
        <CheckIcon />
      </IconButton>
    );
  }

  return (
    <button
      {...props}
      onClick={onClick}
      type={type ? type : "submit"}
      className={`button_sec overflow-hidden font-bold ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
