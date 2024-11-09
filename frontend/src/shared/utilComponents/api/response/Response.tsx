import { useContext } from "react";
import { ResponseContext } from "../../context/response-context";
import { motion } from "framer-motion";

const Response = () => {
  const { onSuccessMsg, onErrorMsg } = useContext(ResponseContext);

  return (
    <div className="px-page flex justify-end mt-3 w-full gap-2 z-19">
      {onSuccessMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }} // Starts above the element and invisible
          animate={{ y: 0, opacity: 1 }}   // Moves to its final position with full opacity
          exit={{ y: -20, opacity: 0 }}    // Moves back up when exiting, invisible
          transition={{ duration: 0.3 }}    // Sets the transition duration for the animation
          className="text-custom-green text-sm font-bold w-fit px-3 py-2 outline rounded-full shadow shadow-custom-grey bg-custom-white"
        >
          {onSuccessMsg}
        </motion.p>
      )}
      {onErrorMsg && (
        <motion.p
          initial={{ y: -20, opacity: 0 }} // Starts above the element and invisible
          animate={{ y: 0, opacity: 1 }}   // Moves to its final position with full opacity
          exit={{ y: -20, opacity: 0 }}    // Moves back up when exiting, invisible
          transition={{ duration: 0.3 }}    // Sets the transition duration for the animation
          className="text-custom-red text-sm font-bold w-fit px-3 py-2 outline rounded-full shadow shadow-custom-grey bg-custom-white"
        >
          {onErrorMsg}
        </motion.p>
      )}
    </div>
  );
};

export default Response;
