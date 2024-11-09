import React from "react";

// Utility function for handling loading, error, and empty states
const handleQueryStates = (
  isLoading: boolean,
  error: Error | null,
  data: any,
  response: { setIsLoading: (loading: boolean) => void; setErrorMsg: (msg: string) => void; }
): JSX.Element | null => {
  if (isLoading) {
    response.setIsLoading(true);
    return <p>Loading...</p>;
  }

  if (error) {
    response.setErrorMsg(error.message);
    return <p>Error: {error.message}</p>;
  }

  if (Object.keys(data).length === 0) {
    return <p>Empty...</p>;
  }

  return null;
};

export default handleQueryStates;
