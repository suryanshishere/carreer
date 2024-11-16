import { IUserData } from "models/userModel/IUserData";

export function userDataHandler(newData: IUserData): void {
  // Retrieve existing user data from localStorage
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

  // Check if sessionExpireMsg is provided
  const { sessionExpireMsg } = newData;

  let updatedUserData: IUserData;

  if (sessionExpireMsg !== undefined) {
    // If sessionExpireMsg is provided, set only sessionExpireMsg
    updatedUserData = { sessionExpireMsg };
  } else {
    // Otherwise, merge new data with the existing data, preserving current values for unspecified fields
    updatedUserData = { ...currentUserData, ...newData };
  }

  // Save the updated data back to localStorage
  localStorage.setItem("userData", JSON.stringify(updatedUserData));
}
