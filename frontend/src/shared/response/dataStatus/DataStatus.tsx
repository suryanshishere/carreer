import React, { CSSProperties, useEffect, useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import "./DataStatus.css";

interface ResponseProps {
  error?: string | null;
  resMsg?: string | null;
  permanentResMsg?: string | null;
  clearError?: () => void;
  style?: CSSProperties;
}

const DataStatus: React.FC<ResponseProps> = ({
  error = null,
  resMsg = null,
  permanentResMsg = null,
  clearError,
  style,
}) => {
  const [modalShow, setModalShow] = useState(true); // True, as I know it's already being called.
  const dispatch = useDispatch();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Start the timer to clear error and response messages after 3 seconds
    if (error || resMsg) {
      timer = setTimeout(() => {
        if (clearError) {
          clearError();
        }
        dispatch(dataStatusUIAction.clearResponse());
        setModalShow(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [clearError, dispatch, error, resMsg]);

  const cancelHandler = () => {
    if (clearError) {
      clearError();
    }
    dispatch(dataStatusUIAction.clearResponse());
    setModalShow(false);
  };

  return (
    <div className="flex items-center gap-1 font-bold" style={style}>
      {permanentResMsg && (
        <p
          style={{ color: "var(--color-dark-blue)" }} // Style for permanent response messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {permanentResMsg}
        </p>
      )}
      {resMsg && modalShow && (
        <p
          style={{ color: "var(--color-green)" }} // Style for response messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {resMsg}
        </p>
      )}
      {error && modalShow && (
        <p
          style={{ color: "var(--color-red)" }} // Style for error messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {error}
        </p>
      )}
    </div>
  );
};

export default DataStatus;
