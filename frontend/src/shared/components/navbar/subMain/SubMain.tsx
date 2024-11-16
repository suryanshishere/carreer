import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";
import Navlinks from "./Navlinks";
import NavAccountList from "./NavAccountList";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();
  return (
    <AnimatePresence>
      {showSubNav && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className={`bg-custom-pale-yellow h-sub-nav text-base px-page overflow-hidden z-20 w-full flex justify-between items-center gap-2`}
        >
          <Navlinks />
          <NavAccountList/>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubMain;
