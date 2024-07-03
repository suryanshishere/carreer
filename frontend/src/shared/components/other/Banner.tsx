import React, { ReactNode } from "react";
import "./Banner.css";

interface BannerProps {
  className?: string;
  children?: ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children, className }) => {
  return <div className={`banner_sec ${className}`}>{children}</div>;
};

export default Banner;
