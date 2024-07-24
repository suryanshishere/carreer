import React, { CSSProperties, useEffect, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import Para from "shared/components/uiElements/cover/Para";
import "./DataStatus.css";

interface ResponseProps {
  error?: string | null;
  responseMsg?: string | null;
  clearError?: () => void;
  style?: CSSProperties;
}

const DataStatus: React.FC<ResponseProps> = ({
  error = null,
  responseMsg = null,
  clearError,
  style,
}) => {
  const [modalShow, setModalShow] = useState(true); //True, as I it's knows already that being called.
  const dispatch = useDispatch();

  //after every 3sec it's leave.
  // useEffect(() => {
  //   setModalShow(true);

  //   const timer = setTimeout(() => {
  //     if (clearError) {
  //       clearError();
  //     }
  //     dispatch(dataStatusUIAction.clearResponse());
  //     setModalShow(false);
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, [clearError, dispatch]);

  const cancelHandler = () => {
    if (clearError) {
      clearError();
    }
    dispatch(dataStatusUIAction.clearResponse());
    setModalShow(false);
  };

  if (!modalShow) return null;

  return (
    <p
      className="flex items-center gap-2"
      style={{
        ...style,
        color: responseMsg
          ? "var(--color-green)"
          : error
          ? "var(--color-brown)"
          : "var(--color-black)",
      }}
    >
      <FontAwesomeIcon icon={faCircleExclamation} /> {responseMsg || error}
    </p>
  );
};

export default DataStatus;
