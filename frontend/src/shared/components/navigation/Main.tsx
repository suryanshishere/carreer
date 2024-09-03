import React from "react";
import Navlinks from "./Navlinks";
import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
import Features from "shared/components/features/Features";
import Response from "shared/utilComponents/response/Response";
import useHandleScroll from "shared/utilComponents/hooks/sub-nav-scroll-hook";

const MainNavigation: React.FC = () => {
  const showSubNav = useHandleScroll();

  return (
    <div className="main_nav_sec transition-transform ease-in-out duration-300 bg-custom-dark-blue fixed w-full flex flex-col items-center gap-2 pb-1 z-20">
      <div className="main_nav px-page font-bold text-custom-white h-main-nav w-full flex items-center justify-between gap-2">
        <header className="text-3xl">careerjankari</header>
        <NavSearch />
        <NavAccount />
      </div>
      {showSubNav && (
        <div
        className="px-page h-custom-sub-nav text-nav overflow-y-auto whitespace-nowrap bg-custom-white w-full flex justify-between items-center gap-2 transition-transform ease-in-out duration-300"
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
