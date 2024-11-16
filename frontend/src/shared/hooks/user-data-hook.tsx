import { IUserData } from "models/userModel/IUserData";

const defaultUserData: IUserData = {
  email: undefined,
  userId: "", // default to an empty string
  token: "",
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

    // Ensure userId is an empty string if it is undefined or empty
    if (!userData.userId) {
      userData.userId = "";
    }

    if (!userData.token) {
      userData.token = "";
    }

    userData.isEmailVerified = userData.isEmailVerified === "1";
    return userData;
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return defaultUserData;
  }
};

export default useUserData;
