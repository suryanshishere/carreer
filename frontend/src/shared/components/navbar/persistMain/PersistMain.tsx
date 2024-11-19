import Auth from "user/pages/auth/Auth";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const PersistMain = () => {
  const isNavAuthClicked = useSelector((state: RootState) => state.auth.isNavAuthClicked);

  return (
    <AnimatePresence>
      {isNavAuthClicked && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
          className="h-auth-nav bg-custom-white w-full px-page flex items-center justify-between z-20 text-base gap-4"
        >
          <Auth />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersistMain;
