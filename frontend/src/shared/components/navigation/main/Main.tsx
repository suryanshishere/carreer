import React from "react";
import NavAccount from "./NavAccount";

const Main: React.FC = () => {
  return (
    <div className="px-page font-bold text-custom-white h-main-nav bg-custom-grey w-full flex items-center justify-between gap-2 z-30">
      <header className="text-2xl">sarkari-jankari</header>
      <NavAccount />
    </div>
  );
};

export default Main;
