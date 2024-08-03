import { userDataHandler } from "shared/localStorageConfig/userDataHandler";
import { IUserData } from "models/user/IUserData";

const EXPIRE_MESSAGE = "Your session has expired. Please log in again.";

export const isLoggedIn = () => {
  //since can't use react component in ts component
  const userDataString = localStorage.getItem("userData");
  let currentUserData: IUserData = {
    email: undefined,
    userId: undefined,
    token: undefined,
    expiration: undefined,
    emailVerified: undefined,
    sessionExpireMsg: undefined,
  };

  if (userDataString) {
    try {
      currentUserData = JSON.parse(userDataString);
    } catch (error) {
      console.error("Error parsing userData from localStorage:", error);
    }
  }

  const { token, expiration } = currentUserData;

  if (token === undefined || expiration === undefined) {
    return false;
  } else if (token && new Date(expiration) >= new Date()) {
    return true;
  } else {
    userDataHandler({ sessionExpireMsg: EXPIRE_MESSAGE });
    return false;
  }
};
