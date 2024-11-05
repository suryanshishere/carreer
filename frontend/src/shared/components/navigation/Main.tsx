import React, { useContext } from "react";
import Navlinks from "./Navlinks";
// import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
// import Features from "shared/components/features/Features";
// import Response from "shared/utilComponents/response/Response";
import useHandleScroll from "shared/utilComponents/hooks/sub-nav-scroll-hook";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import Auth from "user/pages/auth/Auth";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

const MainNavigation: React.FC = () => {
  const showSubNav = useHandleScroll();
  const auth = useContext(AuthContext);

  return (
    <div className="fixed w-full  flex flex-col justify-center z-30">
      <div className="px-page font-bold text-custom-white h-main-nav bg-custom-grey w-full flex items-center justify-between gap-2 z-30">
        <header className="text-2xl">sarkari-jankari</header>
        {/* <NavSearch /> */}
        <NavAccount />
      </div>
      <div
        className={`h-auth-nav border-b-2 border-custom-grey w-full px-page bg-custom-white flex items-center justify-between z-20 text-base gap-4 transition-transform ease-in-out duration-300 ${
          auth.clickedAuth
            ? "translate-y-0"
            : "-translate-y-40"
        }`}
      >
        <Auth onClose={() => auth.authClickedHandler(false)} />
      </div>
      <div
        className={`border-b-2 border-custom-grey h-sub-nav text-nav px-page overflow-y-auto whitespace-nowrap  bg-custom-white text-base z-19 bg-custom-grey w-full flex justify-between items-center gap-2 transition-transform ease-in-out duration-300 ${
          showSubNav
            ?  auth.clickedAuth 
              ? "translate-y-0"
              : "-translate-y-20"
            : "-translate-y-40"
        }`}
      >
        <Navlinks />
        {/* <Features /> */}
        {/* <Response /> */}
      </div>
    </div>
  );
};

export default MainNavigation;
