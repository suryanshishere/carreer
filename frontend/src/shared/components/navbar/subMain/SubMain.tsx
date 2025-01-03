import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";
import Navlinks from "./Navlinks";
import TAGS from "db/postDb/tags.json";

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
          className="bg-custom-pale-yellow h-sub-nav text-base overflow-hidden flex justify-center items-center gap-4"
        >
          <Navlinks />
          <div className="flex gap-2">
            {TAGS.map((item) => (
              <div key={item.label} className="flex items-center gap-1 text-xs">
                <span className={`h-3 w-3 bg-${item.color}`}></span>
                <h6>{item.label}</h6>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubMain;
