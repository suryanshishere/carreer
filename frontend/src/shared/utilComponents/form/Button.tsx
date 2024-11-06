import React, { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  classProp?: string;
  type?: "button" | "submit" | "reset";
  outline?: boolean;
  // href?: string;
  // commonLoading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp,
  style,
  // commonLoading,
  disabled,
  type = "button",
  onClick,
  outline,
  // href,
}) => {
  // Check if classProp contains any rounded-related classes
  const hasRoundedClass = classProp
    ?.split(" ")
    .some((cls) => cls.includes("rounded"));
  return (
    <button
      onClick={onClick}
      type={type}
      style={{ cursor: disabled ? "default" : "", ...style }}
      disabled={disabled}
      className={`flex items-center justify-center ${
        !hasRoundedClass ? "rounded" : ""
      } ${
        outline && "border border-custom-grey hover:bg-custom-hover-faint p-button"
      } min-w-fit whitespace-nowrap px-button-x py-button-y text-base overflow-hidden ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
