import React, { ReactNode } from "react";
import "./Box.css";

interface BoxProps {
  children: ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return <div className={`box_sec w-full p-1 ${className}`}>{children}</div>;
};

export default Box;
