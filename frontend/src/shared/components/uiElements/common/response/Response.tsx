import React from "react";
import Error from "./Response&Error";

interface ResponseProps {
  error?: string | null;
  responseMsg?: string | null;
  clearError?: () => void;
}

const Response: React.FC<ResponseProps> = ({
  error,
  responseMsg,
  clearError,
}) => {
  return (
    <>
      {error && <Error responseOnTop error={error} clearError={clearError} />}
      {responseMsg && (
        <Error responseMsgBool responseOnTop error={responseMsg} />
      )}
    </>
  );
};

export default Response;
