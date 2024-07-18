import React, { CSSProperties, useEffect, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import "./Response.css";
import Para from "shared/components/uiElements/cover/Para";

interface ResponseProps {
  error?: string | null;
  responseMsg?: string | null;
  clearError?: () => void;
  style?: CSSProperties;
}

const Response: React.FC<ResponseProps> = ({
  error = null,
  responseMsg = null,
  clearError,
  style,
}) => {
  const [modalShow, setModalShow] = useState(true); //True, as I it's knows already that being called.
  const dispatch = useDispatch();

  useEffect(() => {
    setModalShow(true);

    const timer = setTimeout(() => {
      if (clearError) {
        clearError();
      }
      dispatch(responseUIAction.clearResponse());
      setModalShow(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [clearError, dispatch]);

  const cancelHandler = () => {
    if (clearError) {
      clearError();
    }
    dispatch(responseUIAction.clearResponse());
    setModalShow(false);
  };


  if (!modalShow) return null;

  return (
    <div className="w-full flex justify-center mr-3" style={style}>
      <Para
        className="text-center text-sm mr-3 mb-3"
        style={{
          color: error
            ? "var(--color-brown)"
            : responseMsg
            ? "var(--color-green)"
            : "var(--color-black)",
        }}
      >
        <FontAwesomeIcon icon={faCircleExclamation} /> {responseMsg || error}
      </Para>
    </div>
  );
};

export default Response;
