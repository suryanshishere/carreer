import React, { useContext } from "react";
import Navlinks from "./Navlinks";
import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
import Features from "shared/components/features/Features";
// import Response from "shared/utilComponents/response/Response";
import useHandleScroll from "shared/utilComponents/hooks/sub-nav-scroll-hook";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import Auth from "user/pages/auth/Auth";

const MainNavigation: React.FC = () => {
  const showSubNav = useHandleScroll();
  const auth = useContext(AuthContext);

  return (
    <div className="fixed w-full  flex flex-col justify-center">
      <div className="px-page font-bold text-custom-white h-main-nav bg-custom-grey w-full flex items-center justify-between gap-2 z-20">
        <header className="text-2xl">sarkari-jankari</header>
        {/* <NavSearch /> */}
        <NavAccount />
      </div>
      {auth.clickedAuth && <Auth onClose={()=>auth.authClickedHandler(false)} />}
      <div
        className={`py-1 h-custom-sub-nav text-nav overflow-y-auto whitespace-nowrap z-15 bg-custom-grey w-full flex justify-between items-center gap-2 transition-transform ease-in-out duration-300 ${
          showSubNav ? "translate-y-0" : "-translate-y-20 "
        }`}
      >
        <div className="w-full px-page bg-custom-white text-base">
          <Navlinks />
          {/* <Features /> */}
          {/* <Response /> */}
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
