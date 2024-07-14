import React from "react";
import "./Features.css";
import Response from "shared/components/uiElements/common/response/Response";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const Features = () => {
  const error = useSelector((state: RootState) => state.response.error);
  const responseMsg = useSelector(
    (state: RootState) => state.response.responseMsg
  );

  return (
    <div className="features_sec overflow-hidden fixed flex items-center justify-end">
      <Response error={error} responseMsg={responseMsg} />
    </div>
  );
};

export default Features;
