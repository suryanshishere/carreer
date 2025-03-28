import React from "react";
import NavAccount from "./NavAccount";
import Mode from "./NavMaxMode";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const LOGO = process.env.REACT_APP_LOGO || "saarkaari";

const Main: React.FC = () => {
  const token  = useSelector((state: RootState) => state.user.token);
  return (
    <div className="relative page_padding w-full text-custom_white h-main-nav bg-custom_gray flex items-center justify-between gap-2 z-30">
      <header className="text-2xl font-bold">{LOGO}</header>
      <div className="flex items-center gap-2">
        <NavAccount />
        {token && <Mode />}
      </div>
    </div>
  );
};

export default Main;
