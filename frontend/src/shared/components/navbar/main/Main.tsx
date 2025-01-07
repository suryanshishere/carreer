import React from "react";
import NavAccount from "./NavAccount";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";

const Main: React.FC = () => {
  return (
    <div className="lg:px-page px-page-small w-full text-base text-custom-white md:h-main-nav h-main-nav-sm bg-custom-gray flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">{LOGO}</header>
      <NavAccount />
    </div>
  );
};

export default Main;
