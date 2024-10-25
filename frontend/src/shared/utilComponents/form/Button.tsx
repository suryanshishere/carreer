import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  classProp?: string;
  type?: "button" | "submit" | "reset";
  noOutline?: boolean;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp,
  tick,
  type,
  onClick,
  noOutline,
  href
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`cursor-pointer flex items-center justify-center p-button border-2 hover:bg-custom-hover-faint overflow-hidden ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
