import React from "react";
import Navlinks from "./Navlinks";
import "./Main.css";
import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
import Features from "general/pages/features/Features";

const MainNavigation: React.FC = () => {
  return (
    <div className="main_nav_sec flex flex-col gap-2 p-1">
      <div className="main_nav flex items-center justify-between gap-2 pl-2 pr-2">
        <header className="text-center">careerbag.in</header>
        <NavSearch />
        <NavAccount />
      </div>
      <div className="sub_main_nav flex justify-between items-center gap-2 pl-2 pr-2">
        <Navlinks />
        <Features/>
      </div>
    </div>
  );
};

export default MainNavigation;
