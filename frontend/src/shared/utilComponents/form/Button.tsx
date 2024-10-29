import React, { ButtonHTMLAttributes, StyleHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  classProp?: string;
  // styleProp?:StyleHTMLAttributes;
  type?: "button" | "submit" | "reset";
  noOutline?: boolean;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp,
  style,
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
      style={style}
      className={`cursor-pointer flex items-center justify-center p-button border-2 w-auto whitespace-nowrap overflow-hidden ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
