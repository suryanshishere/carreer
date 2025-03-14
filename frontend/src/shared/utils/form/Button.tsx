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
  contributeSaveButton?: boolean;
  basicButton?: boolean;
  iconButton?: boolean; // New prop for icon button variant
}

const Button: React.FC<ButtonProps> = ({
  children,
  classProp = "",
  style,
  disabled,
  type = "button",
  onClick,
  loginSignupType,
  authButtonType,
  warning,
  contributeSaveButton,
  iconButton,
  basicButton,
  ...rest
}) => {
  // Common props applied to every button
  const commonProps = { onClick, disabled, type, style, ...rest };
  // Ensure "rounded" is present unless already provided in classProp
  const roundedClass = classProp.includes("rounded") ? "" : "rounded";


  if (basicButton) {
    const baseClase = "w-full whitespace-nowrap hover:bg-custom_less_gray transform duration-100 ease-linear px-2 py-1 "
    return (
      <button
        {...commonProps}
        className={`${baseClase} ${roundedClass} ${classProp}`}
      >
        {children}
      </button>
    );
  }

  // Contribute Save Button
  if (contributeSaveButton) {
    const baseClass = `flex-1 py-[.5rem] px-[0.5rem] md:py-[.45rem] whitespace-nowrap rounded transform ease-linear duration-200`;
    const stateClass = !disabled
      ? "bg-custom_blue text-custom_white hover:bg-custom_dark_blue"
      : "bg-custom_less_gray text-custom_gray cursor-not-allowed";
    return (
      <button
        {...commonProps}
        className={`${baseClass} ${stateClass} ${classProp}`}
      >
        {children}
      </button>
    );
  }

  // Login/Signup Button with extra hover layers
  if (loginSignupType) {
    return (
      <button
        {...commonProps}
        className={`relative inline-block font-medium group ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${classProp}`}
      >
        <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-black group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
        <span className="absolute inset-0 w-full h-full bg-custom_red border-2 border-black group-hover:bg-custom_red"></span>
        <span className="relative text-custom_white group-hover:text-white">
          {children}
        </span>
      </button>
    );
  }

  // Auth Button
  if (authButtonType) {
    const baseClass = `flex items-center justify-center min-w-fit whitespace-nowrap text-base overflow-hidden px-3 py-2 rounded-full text-custom_white font-bold`;
    const stateClass = disabled
      ? "cursor-not-allowed bg-custom_less_gray"
      : "cursor-pointer bg-custom_gray hover:bg-custom_black";
    return (
      <button
        {...commonProps}
        className={`${baseClass} ${stateClass} ${classProp}`}
      >
        {children}
      </button>
    );
  }

  // Warning Button
  if (warning) {
    const baseClass = `text-custom_red whitespace-nowrap flex items-center justify-center rounded outline outline-custom_red p-button hover:text-custom_white hover:bg-custom_red min-w-fit whitespace-nowrap px-button-x py-button-y text-base overflow-hidden`;
    const stateClass = disabled ? "cursor-not-allowed" : "cursor-pointer";
    return (
      <button
        {...commonProps}
        className={`${baseClass} ${stateClass} ${classProp}`}
      >
        {children}
      </button>
    );
  }

  // Icon Button Variant
  if (iconButton) {
    return (
      <button
        {...commonProps}
        className={`p-1 rounded-full whitespace-nowrap hover:bg-custom_pale_yellow flex items-center justify-center cursor-pointer text-custom_less_gray hover:text-custom_gray ${classProp} `}
      >
        {children}
      </button>
    );
  }

  // Default Button
  const baseClass = `whitespace-nowrap focus:outline-custom_pale_yellow focus:ring-2 focus:ring-custom_pale_yellow text-center ${roundedClass} outline outline-custom_less_gray p-button ease-linear transform duration-100 w-full py-[.5rem] px-[0.5rem] md:py-[.45rem] text-base overflow-hidden`;
  const stateClass = disabled
    ? "cursor-not-allowed text-custom_gray bg-custom_pale_yellow"
    : "cursor-pointer hover:bg-custom_pale_yellow hover:outline-custom_gray";
  return (
    <button
      {...commonProps}
      className={`${baseClass} ${stateClass} ${classProp}`}
    >
      {children}
    </button>
  );
};

export default Button;
