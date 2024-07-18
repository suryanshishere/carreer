import { userDataHandler } from "shared/localStorageConfig/auth-local-storage";
import useUserData from "shared/localStorageConfig/userData-hook";

const EXPIRE_MESSAGE = "Your session has expired. Please log in again.";

export const isLoggedIn = () => {
  const { token, expiration } = useUserData();

  if (token === undefined || expiration === undefined) {
    return false;
  } else if (token && new Date(expiration) >= new Date()) {
    return true;
  } else {
    userDataHandler("", "", "", "", EXPIRE_MESSAGE);
    return false;
  }
};
