import React from "react";
import "./Features.css";
import Response from "shared/components/feedback/response/Response";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const Features = () => {
  const error = useSelector((state: RootState) => state.response.error);
  const responseMsg = useSelector(
    (state: RootState) => state.response.responseMsg
  );

  if (error && responseMsg) {
    return (
      <div className="features_sec overflow-hidden fixed flex items-center justify-end">
        <Response error={error} responseMsg={responseMsg} />
      </div>
    );
  }

  return null;
};

export default Features;
