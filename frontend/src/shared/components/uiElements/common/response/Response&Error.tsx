import React, { CSSProperties, useEffect, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";
import Para from "../../cover/Para";
import "./Response&Error.css";

interface ErrorProps {
  error: string;
  style?: CSSProperties;
  responseOnTop?: boolean;
  responseMsgBool?: boolean;
  clearError?: () => void;
}

const Error: React.FC<ErrorProps> = ({
  error,
  style,
  responseOnTop,
  responseMsgBool,
  clearError,
}) => {
  const [modalShow, setModalShow] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setModalShow(true);

    const timer = setTimeout(() => {
      if (clearError) {
        clearError();
      }
      dispatch(responseUIAction.clearResponse());
      setModalShow(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [clearError, dispatch]);

  //remove to error manually
  const cancelHandler = () => {
    if (clearError) {
      clearError();
    }
    dispatch(responseUIAction.clearResponse());
    setModalShow(false);
  };

  return (
    <div>
      {responseOnTop && (
        <motion.div
          initial={{ opacity: 1, x: "100%", scale: 0.5 }}
          animate={{
            x: modalShow ? 0 : "100%",
            scale: modalShow ? 1 : 0.5,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
          exit={{ opacity: 1, x: "0", scale: 0.5 }} 
          className={`behave_error w-fit font-bold flex items-center justify-end ${
            responseMsgBool ? "response_msg" : "error_msg"
          }`}
        >
          {error}
        </motion.div>
      )}
      {!responseOnTop && (
        <div className="w-full flex justify-center mr-3" style={style}>
          <Para
            className="text-center text-sm mr-3 mb-3"
            style={{ color: "var(--color-brown)" }}
          >
            <FontAwesomeIcon icon={faCircleExclamation} /> {error}
          </Para>
        </div>
      )}
    </div>
  );
};

export default Error;
