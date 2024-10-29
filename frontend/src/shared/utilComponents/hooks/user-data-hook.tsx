import { IUserData } from "models/userModel/IUserData";

const defaultUserData: IUserData = {
  email: undefined,
  userId: undefined,
  token: undefined,
  expiration: undefined,
  isEmailVerified: undefined,
  sessionExpireMsg: undefined,
};

const useUserData = (): IUserData => {
  const userDataString = localStorage.getItem("userData");

  if (!userDataString) {
    return defaultUserData;
  }

  try {
    let userData: IUserData = JSON.parse(userDataString);
    userData.isEmailVerified = userData.isEmailVerified === "1";
    return userData;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return defaultUserData;
  }
};

export default useUserData;
