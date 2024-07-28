import React from "react";
import Navlinks from "./Navlinks";
import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
import Features from "general/pages/features/Features";
import Response from "shared/response/Response";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";
import "./Main.css";

const MainNavigation: React.FC = () => {
  const showSubNav = useHandleScroll();

  return (
    <div className="main_nav_sec fixed w-full flex flex-col gap-2 pb-1 z-50">
      <div className="main_nav flex items-center justify-between gap-2">
        <header className="text-center">careerbag.in</header>
        <NavSearch />
        <NavAccount />
      </div>
      {showSubNav && (
        <div
          className={`sub_main_nav flex justify-between items-center gap-2 transition-transform duration-300`}
        >
          <Navlinks />
          <Features />
          <Response />
        </div>
      )}
    </div>
  );
};

export default MainNavigation;
