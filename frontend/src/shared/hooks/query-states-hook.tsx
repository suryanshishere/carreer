import React, { useContext, useEffect } from "react";
import { ResponseContext } from "shared/context/response-context";

interface QueryStateProps {
  isLoading: boolean;
  error: string | null;
  empty: boolean;
}

const useQueryStates = ({
  isLoading,
  error,
  empty,
}: QueryStateProps): JSX.Element | null => {
  const response = useContext(ResponseContext);

  useEffect(() => {
    if (error && !isLoading) {
      response.setErrorMsg(error);
    }
  }, [error, isLoading]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!isLoading && error) {
    return <p>Error: {error}</p>;
  }
  if (empty) {
    return <p>Empty...</p>;
  }

  return null;
};

export default useQueryStates;
