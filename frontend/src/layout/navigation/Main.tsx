import React from "react";
import nav_logo from "src/assets/shared/nav/logo.svg";
import Navlinks from "./Navlinks";
import "./Main.css";

const MainNavigation: React.FC = () => {
  return (
    <div className="main_nav_sec fixed w-full flex gap-10 items-end justify-between z-10">
      <img src={nav_logo} alt="thejobs" />
      <Navlinks />
    </div>
  );
};

export default MainNavigation;
