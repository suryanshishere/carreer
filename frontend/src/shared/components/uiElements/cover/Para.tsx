import React, { ReactNode, CSSProperties } from "react";
import "./Para.css";

interface ParaProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  paraMsg?: boolean;
}

const Para: React.FC<ParaProps> = ({ children, className, style, paraMsg }) => {
  if (paraMsg) {
    return (
      <p className={`para_msg_sec font-bold flex-1 ${className}`} style={style}>
        {children}
      </p>
    );
  }

  return (
    <p className={`para_sec ml-1 font-bold ${className}`} style={style}>
      {children}
    </p>
  );
};

export default Para;
