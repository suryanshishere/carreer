import React, { useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import "./DataStatus.css";

interface ResponseProps {
  error?: string[];
  resMsg?: string[];
  permanentResMsg?: string[];
}

const DataStatus: React.FC<ResponseProps> = ({
  error = [],
  resMsg = [],
  permanentResMsg = [],
}) => {
  const [modalShow, setModalShow] = useState(true);
  const dispatch = useDispatch();

  // Helper function to get the last element of an array
  const getLastItem = (arr: string[]) => (arr.length ? arr[arr.length - 1] : null);

  // Get the last item of error, resMsg, and permanentResMsg
  const latestError = getLastItem(error);
  const latestResMsg = getLastItem(resMsg);
  const latestPermanentResMsg = getLastItem(permanentResMsg);

  return (
    <div className="flex items-center gap-1 font-bold">
      {latestPermanentResMsg && (
        <p
          style={{ color: "var(--color-dark-blue)" }} // Style for permanent response messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {latestPermanentResMsg}
        </p>
      )}
      {latestResMsg && modalShow && (
        <p
          style={{ color: "var(--color-green)" }} // Style for response messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {latestResMsg}
        </p>
      )}
      {latestError && modalShow && (
        <p
          style={{ color: "var(--color-red)" }} // Style for error messages
        >
          <FontAwesomeIcon icon={faCircleExclamation} /> {latestError}
        </p>
      )}
    </div>
  );
};

export default DataStatus;
