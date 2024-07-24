import React from "react";
import "./Features.css";
import Response from "shared/feedback/dataStatus/DataStatus";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const Features = () => {
  const error = useSelector((state: RootState) => state.dataStatus.error);
  const responseMsg = useSelector(
    (state: RootState) => state.dataStatus.responseMsg
  );  

  if (error || responseMsg) {
    return (
      <div className="features_sec overflow-hidden flex items-center justify-end">
        <Response error={error} responseMsg={responseMsg} />
      </div>
    );
  }

  return null;
};

export default Features;
