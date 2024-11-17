import { useContext } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "shared/store";

const Response = () => {
  const { successMsg, errorMsg } = useSelector((state: RootState) => ({
    successMsg: state.response.onSuccessMsg,
    errorMsg: state.response.onErrorMsg,
    isLoading: state.response.isLoading,
  }));

  return (
    <div className="px-page text-sm text-custom-white rounded font-bold flex justify-end mt-1 w-full gap-2 z-19">
      {successMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom-green rounded m-1"
        >
          {successMsg}
        </motion.p>
      )}
      {errorMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom-red rounded m-1"
        >
          {errorMsg}
        </motion.p>
      )}
    </div>
  );
};

export default Response;
