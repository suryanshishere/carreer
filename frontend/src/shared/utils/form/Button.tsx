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
  ...rest
}) => {
  // Common props applied to every button
  const commonProps = { onClick, disabled, type, style, ...rest };

  // Contribute Save Button
  if (contributeSaveButton) {
    const baseClass = `flex-1 py-[.5rem] px-[0.5rem] md:py-[.45rem] rounded transform ease-linear duration-200`;
    const stateClass = !disabled
      ? "bg-custom-blue text-custom-white hover:bg-custom-dark-blue"
      : "bg-custom-less-gray text-custom-gray cursor-not-allowed";
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
        <span className="absolute inset-0 w-full h-full bg-custom-red border-2 border-black group-hover:bg-custom-red"></span>
        <span className="relative text-custom-white group-hover:text-white">
          {children}
        </span>
      </button>
    );
  }

  // Auth Button
  if (authButtonType) {
    const baseClass = `flex items-center justify-center min-w-fit whitespace-nowrap text-base overflow-hidden px-3 py-2 rounded-full text-custom-white font-bold hover:bg-custom-black`;
    const stateClass = disabled
      ? "cursor-not-allowed bg-custom-black"
      : "cursor-pointer bg-custom-gray";
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
    const baseClass = `text-custom-red flex items-center justify-center rounded outline outline-custom-red p-button hover:text-custom-white hover:bg-custom-red min-w-fit whitespace-nowrap px-button-x py-button-y text-base overflow-hidden`;
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
        className={`p-1 rounded-full hover:bg-custom-pale-yellow flex items-center justify-center cursor-pointer text-custom-less-gray hover:text-custom-gray ${classProp} `}
      >
        {children}
      </button>
    );
  }

  // Default Button
  // Ensure "rounded" is present unless already provided in classProp
  const roundedClass = classProp.includes("rounded") ? "" : "rounded";
  const baseClass = `flex items-center justify-center ${roundedClass} outline outline-custom-super-less-gray p-button hover:bg-custom-super-less-gray w-full whitespace-nowrap py-[.5rem] px-[0.5rem] md:py-[.45rem] text-base overflow-hidden`;
  const stateClass = disabled
    ? "cursor-not-allowed text-custom-super-less-gray"
    : "cursor-pointer";
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
