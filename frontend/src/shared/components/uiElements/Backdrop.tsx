import React from "react";

import "./Backdrop.css";

interface BackdropProps {
  onClick?: () => void;
}

const Backdrop: React.FC<BackdropProps> = (props) => {
  return (
    <div
      className="backdrop top-0 left-0 w-full h-screen opacity-80 fixed z-20"
      onClick={props.onClick}
    ></div>
  );
};

export default Backdrop;
