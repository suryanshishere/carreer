import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/utilComponents/store";
import DataStatus from "./dataStatus/DataStatus";
import "./Response.css";

const Response = () => {
  const error = useSelector((state: RootState) => state.dataStatus.error);
  const resMsg = useSelector((state: RootState) => state.dataStatus.resMsg);
  const permanentResMsg = useSelector(
    (state: RootState) => state.dataStatus.permanentResMsg
  );

  if (error || resMsg || permanentResMsg) {
    return (
      <div className="features_sec overflow-hidden flex items-center justify-end">
        <DataStatus
          error={error}
          resMsg={resMsg}
          permanentResMsg={permanentResMsg}
        />
      </div>
    );
  }

  return null;
};

export default Response;
