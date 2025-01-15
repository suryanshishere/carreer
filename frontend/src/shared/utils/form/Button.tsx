import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  tick?: boolean;
  classProp?: string;
  type?: "button" | "submit" | "reset";
  outline?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  loginSignupType?: boolean;
  authButtonType?: boolean;
  warning?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp,
  style,
  disabled,
  type = "button",
  onClick,
  loginSignupType,
  authButtonType,
  warning,
}) => {
  if (loginSignupType) {
    return (
      <button
        type={type}
        style={{ ...style }}
        disabled={disabled}
        onClick={onClick}
        className={`relative inline-block font-medium group ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${classProp}`}
      >
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-custom-red border-2 border-black group-hover:bg-custom-red"></span>
        <span className="relative text-custom-white group-hover:text-white">
          {children}
        </span>
      </button>
    );
  }

  if (authButtonType) {
    return (
      <button
        onClick={onClick}
        type={type}
        style={{ ...style }}
        disabled={disabled}
        className={`flex items-center justify-center min-w-fit whitespace-nowrap text-base overflow-hidden py-2 rounded-full text-custom-white font-bold px-3 hover:bg-custom-black ${
          disabled ? "cursor-not-allowed bg-custom-black" : "cursor-pointer bg-custom-gray"
        } ${classProp || "bg-custom-gray"}`}
      >
        {children}
      </button>
    );
  }

  if (warning) {
    return (
      <button
        onClick={onClick}
        type={type}
        style={{ ...style }}
        disabled={disabled}
        className={`text-custom-red flex items-center justify-center rounded outline outline-custom-red p-button hover:text-custom-white hover:bg-custom-red min-w-fit whitespace-nowrap px-button-x py-button-y text-base overflow-hidden ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${classProp}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      style={{ ...style }}
      disabled={disabled}
      className={`flex items-center justify-center ${
        classProp?.includes("rounded") ? "" : "rounded"
      } outline outline-custom-super-less-gray p-button hover:bg-custom-super-less-gray w-full whitespace-nowrap px-button-x py-button-y text-base overflow-hidden ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
