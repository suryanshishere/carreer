import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const JsxResponse = () => {
  const jsxResponseMsg = useSelector(
    (state: RootState) => state.dataStatus.jsxResponseMsg
  );

  return <div>{jsxResponseMsg}</div>;
};

export default JsxResponse;
