import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";
import Navlinks from "./Navlinks";
import TAGS from "db/postDb/tags.json";
import Tags from "./Tags";

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
          className="lg:px-page px-page-small w-full bg-custom-pale-yellow md:h-sub-nav h-sub-nav-sm text-base flex justify-center items-center gap-2"
        >
          <Navlinks />
          <Tags />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubMain;
