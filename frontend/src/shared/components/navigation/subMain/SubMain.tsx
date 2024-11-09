import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHandleScroll from "shared/utilComponents/hooks/sub-nav-scroll-hook";
import Navlinks from "./Navlinks";

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
          className={`shadow-sm shadow-custom-grey h-sub-nav text-base px-page overflow-y-auto whitespace-nowrap bg-custom-white text-base z-20 bg-custom-grey w-full flex justify-between items-center gap-2`}
        >
          <Navlinks />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubMain;
