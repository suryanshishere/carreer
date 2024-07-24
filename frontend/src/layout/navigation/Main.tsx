import React, { useState, useEffect, useCallback } from "react";
import Navlinks from "./Navlinks";
import NavSearch from "./NavSearch";
import NavAccount from "./NavAccount";
import Features from "general/pages/features/Features";
import Response from "shared/response/Response";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { throttle } from "shared/helpers/throttle";
import "./Main.css";
import Loading from "shared/response/dataStatus/Loading";

const MainNavigation: React.FC = () => {
  const [showSubNav, setShowSubNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const error = useSelector((state: RootState) => state.dataStatus.error);
  const resMsg = useSelector(
    (state: RootState) => state.dataStatus.resMsg
  );
  const loading = useSelector((state: RootState) => state.dataStatus.isLoading);

  const handleScroll = useCallback(
    throttle(() => {
      const currentScrollY = window.scrollY;
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 50 &&
        !error &&
        !resMsg
      ) {
        // Scrolling down and no error/response message
        setShowSubNav(false);
      } else {
        // Scrolling up or there is an error/response message
        setShowSubNav(true);
      }
      setLastScrollY(currentScrollY);
    }, 200), // Throttle the function to execute at most once every 200ms
    [lastScrollY, error, resMsg]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="main_nav_sec fixed w-full flex flex-col gap-2 p-1 z-50">
      <div className="main_nav flex items-center justify-between gap-2 pl-2 pr-2">
        <header className="text-center">careerbag.in</header>
        <NavSearch />
        <NavAccount />
      </div>
      {showSubNav && (
        <div
        className={`sub_main_nav flex justify-between items-center gap-2 pl-2 pr-2 transition-transform duration-300`}
        >
          <Navlinks />
          <Features />
          <Response />
        </div>
      )}
      {loading && <Loading loadingOnTop />}
    </div>
  );
};

export default MainNavigation;
