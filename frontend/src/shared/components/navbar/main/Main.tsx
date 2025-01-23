import React from "react";
import NavAccount from "./NavAccount";
import Mode from "./Mode";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";

const LOGO = process.env.REACT_APP_LOGO || "SIRKARI";

const Main: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  return (
<<<<<<< HEAD
    <div className="px-page text-base text-custom-white h-main-nav bg-custom-gray w-full flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">{LOGO}</header>
      <NavAccount />
=======
    <div className="relative lg:px-page px-page-small w-full text-custom-white h-main-nav bg-custom-gray flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">{LOGO}</header>
      <div className="flex items-center gap-2">
        <NavAccount />
        {token && <Mode />}
      </div>
>>>>>>> user
    </div>
  );
};

export default Main;
