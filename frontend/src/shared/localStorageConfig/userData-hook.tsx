import { IUserData } from "models/user/IUserData";

const defaultUserData: IUserData = {
  userId: undefined,
  token: undefined,
  expiration: undefined,
  emailVerified: undefined,
  sessionExpireMsg: undefined,
};

const useUserData = (): IUserData => {
  const userDataString = localStorage.getItem("userData");

  if (!userDataString) {
    return defaultUserData;
  }

  try {
    const userData: IUserData = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return defaultUserData;
  }
};

export default useUserData;
