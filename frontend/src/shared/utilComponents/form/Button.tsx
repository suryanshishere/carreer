import React, { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  classProp?: string;
  type?: "button" | "submit" | "reset";
  noOutline?: boolean;
  href?: string;
  commonLoading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp,
  style,
  tick,
  commonLoading,
  disabled,
  type = "button",
  onClick,
  noOutline,
  href,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      style={{ cursor: disabled ? "default" : "", ...style }}
      disabled={disabled}
      className={`cursor-pointer flex items-center justify-center p-button border-2 min-w-fit whitespace-nowrap overflow-hidden ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
