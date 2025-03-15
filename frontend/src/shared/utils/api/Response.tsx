import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectErrorMsg, selectSuccessMsg } from "shared/store/selectors";

const Response = () => {
  const errorMsg = useSelector(selectErrorMsg);
  const successMsg = useSelector(selectSuccessMsg);

  return (
    <div className="fixed text-sm page_padding text-custom_white rounded font-bold flex justify-center bottom-2 w-full gap-2 z-50">
      {successMsg && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom_green rounded m-1"
        >
          {successMsg}
        </motion.p>
      )}
      {errorMsg && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom_red rounded m-1"
        >
          {errorMsg}
        </motion.p>
      )}
    </div>
  );
};

export default Response;
