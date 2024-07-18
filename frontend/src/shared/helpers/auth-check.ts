import { IUserData } from "models/user/IUserData";
import { getUserData } from "shared/localStorageConfig/auth-local-storage";

export const isLoggedIn = () => {
  const userData = getUserData();
  const { token, expiration } = userData;

  if (token === undefined || expiration === undefined) {
    return false;
  } else if (token && new Date(expiration) >= new Date()) {
    return true;
  }

  return false;
};
