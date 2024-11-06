import React, { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navlinks from "./Navlinks";
import NavAccount from "./NavAccount";
import useHandleScroll from "shared/utilComponents/hooks/sub-nav-scroll-hook";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import Auth from "user/pages/auth/Auth";

const MainNavigation: React.FC = () => {
  const showSubNav = useHandleScroll();
  const auth = useContext(AuthContext);

  return (
    <div className="fixed w-full flex flex-col justify-center z-30">
      {/* Main header */}
      <div className="px-page font-bold text-custom-white h-main-nav bg-custom-grey w-full flex items-center justify-between gap-2 z-30">
        <header className="text-2xl">sarkari-jankari</header>
        <NavAccount />
      </div>

      {/* Auth section with Framer Motion */}
      <AnimatePresence>
        {auth.clickedAuth && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="h-auth-nav border-b-2 border-custom-grey w-full px-page bg-custom-white flex items-center justify-between z-20 text-base gap-4"
          >
            <Auth onClose={() => auth.authClickedHandler(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sub-navigation links with Framer Motion */}
      <AnimatePresence>
        {showSubNav && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className={`border-b-2 border-custom-grey h-sub-nav text-nav px-page overflow-y-auto whitespace-nowrap bg-custom-white text-base z-19 bg-custom-grey w-full flex justify-between items-center gap-2`}
          >
            <Navlinks />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainNavigation;
