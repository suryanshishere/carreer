import React, { ReactNode } from "react";

import "./UIDropdown.css";

interface DropdownProps {
  onClose: () => void;
  children: ReactNode;
  className?: string;
  backdrop?: boolean;
}

const UIDropdown: React.FC<DropdownProps> = ({
  children,
  onClose,
  className,
  backdrop,
}) => {
  return (
    <>
      {backdrop && <div className=" z-10 fixed left-0 top-0 w-screen h-screen" onClick={onClose}></div>}
      <div className={`dropdown_sec z-10 absolute p-1 flex flex-col justify-between gap-1 ${className}`}>{children}</div>
    </>
  );
};

export default UIDropdown;
