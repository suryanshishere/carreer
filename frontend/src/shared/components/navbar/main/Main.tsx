import React from "react";
import NavAccount from "./NavAccount";
import Mode from "./Mode";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";

const Main: React.FC = () => {
  return (
    <div className="lg:px-page px-page-small w-full text-base text-custom-white h-main-nav bg-custom-gray flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">{LOGO}</header>
      <div className="flex items-center gap-2">
        <NavAccount />
        <Mode />
      </div>
    </div>
  );
};

export default Main;
