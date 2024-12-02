import React from "react";
import NavAccount from "./NavAccount";

const Main: React.FC = () => {
  return (
    <div className="px-page text-base text-custom-white h-main-nav bg-custom-gray w-full flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">sarkari-jankari</header>
      <NavAccount />
    </div>
  );
};

export default Main;
