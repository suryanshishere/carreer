import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";
import { IUserData } from "models/userModel/IUserData";

const EXPIRE_MESSAGE = "Your session has expired. Please log in again.";

export const isLoggedIn = () => {
  //since can't use react component in ts component
  const userDataString = localStorage.getItem("userData");
  let currentUserData: IUserData = {
    email: undefined,
    userId: undefined,
    token: undefined,
    expiration: undefined,
    isEmailVerified: undefined,
    sessionExpireMsg: undefined,
  };

  if (userDataString) {
    try {
      currentUserData = JSON.parse(userDataString);
    } catch (error) {
      console.error("Error parsing userData from localStorage:", error);
    }
  }

  const { token, expiration, userId, sessionExpireMsg } = currentUserData;

  if (!token || !expiration) {
    return false;
  }
  if (new Date(expiration) < new Date()) {
    if (!sessionExpireMsg) {
      userDataHandler({ ...currentUserData, sessionExpireMsg: EXPIRE_MESSAGE });
    }
    return false;
  }

  // check for no token, no Expiration, if expiration not pass then set sessionExpire after than pass it
  return true;
};
