import React, { ReactNode, CSSProperties } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties; 
}

const Card: React.FC<CardProps> = ({ children, className, style }) => {
  return (
    <div className={`card_sec ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Card;
