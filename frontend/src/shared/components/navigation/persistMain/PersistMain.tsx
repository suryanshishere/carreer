import React, { useContext } from "react";
import Auth from "user/pages/auth/Auth";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "shared/utilComponents/context/auth-context";

const PersistMain = () => {
  const auth = useContext(AuthContext);
  return (
    <AnimatePresence>
      {auth.clickedAuth && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="h-auth-nav border-b-2 border-custom-grey w-full px-page bg-custom-white flex items-center justify-between z-20 text-base gap-4"
        >
          <Auth />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersistMain;
