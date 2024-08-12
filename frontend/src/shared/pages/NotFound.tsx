import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Para from "shared/uiComponents/cover/Para";
import "./NotFound.css";

interface NotFoundProps {
  children?: React.ReactNode;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ children, className }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // useEffect(() => {
  //   if (!children) {
  //     const timer = setTimeout(() => {
  //       navigate(-1);
  //     }, 10000);

  //     const interval = setInterval(() => {
  //       setCountdown((prevCountdown) => prevCountdown - 1);
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timer);
  //       clearInterval(interval);
      // };
    // }
  // }, [navigate, children]);

  return (
    <div className={`${className} center`}>
      <Para>
        {children
          ? children
          : `Page doesn't exist.`}
      </Para>
    </div>
  );
};

export default NotFound;
