import { useEffect } from "react";
import store from "shared/store";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";

interface QueryStateProps {
  isLoading: boolean;
  error: string | null;
  empty?: boolean;
}

const useQueryStates = ({
  isLoading,
  error,
  empty,
}: QueryStateProps): JSX.Element | null => {
  useEffect(() => {
    if (!isLoading && error) {
      store.dispatch(triggerErrorMsg(error));
    }
  }, [ error, isLoading]);

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
