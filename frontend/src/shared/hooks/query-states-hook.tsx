import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";

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
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!isLoading && error) {
    dispatch(triggerErrorMsg(error));
    return <p>Error: {error}</p>;
  }
  if (empty) {
    return <p>Empty...</p>;
  }

  return null;
};

export default useQueryStates;
