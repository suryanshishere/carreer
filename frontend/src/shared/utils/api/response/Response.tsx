import { useContext } from "react";
import { ResponseContext } from "../../../context/response-context";
import { motion } from "framer-motion";

const Response = () => {
  const { onSuccessMsg, onErrorMsg } = useContext(ResponseContext);
  return (
    <div className="px-page text-sm w-fit text-custom-white rounded font-bold flex justify-end mt-1 w-full gap-2 z-19">
      {onSuccessMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom-green rounded m-1"
        >
          {onSuccessMsg}
        </motion.p>
      )}
      {onErrorMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          exit={{ y: -20, opacity: 0 }} 
          transition={{ duration: 0.3 }}
          className="px-2 py-1 bg-custom-red rounded m-1"
        >
          {onErrorMsg}
        </motion.p>
      )}
    </div>
  );
};

export default Response;
