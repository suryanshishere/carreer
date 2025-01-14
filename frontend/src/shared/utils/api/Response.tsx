import { motion } from "framer-motion";
import {  useSelector } from "react-redux";
import { selectErrorMsg, selectSuccessMsg, selectIsLoading } from "shared/store/selectors";


const Response = () => {
  const errorMsg = useSelector(selectErrorMsg);
  const successMsg = useSelector(selectSuccessMsg);
  // const isLoading = useSelector(selectIsLoading);

  return (
    <div className="absolute text-sm page-padding text-custom-white rounded font-bold flex justify-end mt-1 w-full gap-2 z-19">
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
