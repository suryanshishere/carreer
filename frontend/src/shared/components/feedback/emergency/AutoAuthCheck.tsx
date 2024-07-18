import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthContext } from "shared/context/auth-context";
import { isLoggedIn } from "shared/helpers/auth-check";
import {
  getUserData,
  userDataHandler,
} from "shared/localStorageConfig/auth-local-storage";
import { responseUIAction } from "shared/store/reponse-ui-slice";

const EXPIRE_MESSAGE = "Your session has expired. Please log in again.";

const AutoAuthCheck = () => {
  const auth = useContext(AuthContext);
  const dispatch = useDispatch();
  const userData = getUserData();
  const { userId, token, expiration } = userData;
  const checkIsLoggedIn: boolean = isLoggedIn();

  useEffect(() => {
    if (checkIsLoggedIn) {
      auth.login(userId, token, expiration);
    } else {
      auth.logout();
      dispatch(responseUIAction.setResponseHandler(EXPIRE_MESSAGE));
      // Assuming userDataHandler is a function that handles user data updates
      userDataHandler("", "", "", "", EXPIRE_MESSAGE);
    }
  }, []);

  return null;
};

export default AutoAuthCheck;
