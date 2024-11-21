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
  auth?: boolean;
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
  auth,
  // href,
}) => {
  // Check if classProp contains any rounded-related classes
  const hasRoundedClass = classProp
    ?.split(" ")
    .some((cls) => cls.includes("rounded"));

  if (auth) {
    return (
      <button
        type={type}
        style={{ cursor: disabled ? "default" : "", ...style }}
        disabled={disabled}
        onClick={onClick}
        className={`relative inline-block font-medium group ${classProp}`}
      >
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-custom-red border-2 border-black group-hover:bg-custom-red"></span>
        <span className="relative text-custom-white group-hover:text-white">
          {children}
        </span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      type={type}
      style={{ cursor: disabled ? "default" : "", ...style }}
      disabled={disabled}
      className={`flex items-center justify-center ${
        !hasRoundedClass ? "rounded" : ""
      } ${
        outline &&
        "outline outline-custom-super-less-grey p-button hover:bg-custom-super-less-grey"
      } min-w-fit whitespace-nowrap px-button-x py-button-y text-base overflow-hidden ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
