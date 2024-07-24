import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const JsxResponse = () => {
  const permanentResMsg = useSelector(
    (state: RootState) => state.dataStatus.permanentResMsg
  );

  return <div>{permanentResMsg}</div>;
};

export default JsxResponse;
