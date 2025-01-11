import Auth from "user/pages/auth/Auth";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ActivateAccount from "user/pages/account/ActivateAccount";

const animationProps = {
  initial: { y: -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -40, opacity: 0 },
  transition: { ease: "easeInOut", duration: 0.3 },
  className:
    "page-padding h-fit py-2 bg-custom-yellow flex items-center justify-between z-20 text-base gap-4 ",
};

const PersistMain = () => {
  const { isNavAuthClicked, userData } = useSelector(
    (state: RootState) => state.auth
  );
  const { token, isEmailVerified, deactivatedAt } = userData;

  return (
    <AnimatePresence>
      {(isNavAuthClicked || (token && !isEmailVerified)) && (
        <motion.div {...animationProps}>
          <Auth />
        </motion.div>
      )}
      {token && deactivatedAt && (
        <motion.div {...animationProps}>
          <ActivateAccount />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PersistMain;
