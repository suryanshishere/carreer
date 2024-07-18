interface UserData {
  userId: string | undefined;
  token: string | undefined;
  expiration: string | undefined;
  emailVerified: string | undefined;
  sessionExpireMsg?: string | undefined;
}

export function userDataHandler(
  userId: string,
  token: string,
  expiration: string,
  emailVerified: string,
  sessionExpireMsg?: string
): void {
  const data: UserData = {
    userId,
    token,
    expiration,
    emailVerified,
  };

  if (sessionExpireMsg) {
    data.sessionExpireMsg = sessionExpireMsg;
    data.userId = undefined;
    data.token = undefined;
    data.expiration = undefined;
    data.emailVerified = undefined;
  } else {
    data.sessionExpireMsg = undefined;
  }

  localStorage.setItem("userData", JSON.stringify(data));
}

export function getUserData(): UserData {
  const userDataString = localStorage.getItem("userData");
  if (!userDataString) {
    return {
      userId: undefined,
      token: undefined,
      expiration: undefined,
      emailVerified: undefined,
      sessionExpireMsg: undefined,
    };
  }

  try {
    const userData: UserData = JSON.parse(userDataString);
    const { userId, token, expiration, emailVerified, sessionExpireMsg } =
      userData;

    // Return specific fields if available
    return {
      userId,
      token,
      expiration,
      emailVerified,
      sessionExpireMsg,
    };
  } catch (error) {
    console.error("Error parsing userData from localStorage:", error);
    return {
      userId: undefined,
      token: undefined,
      expiration: undefined,
      emailVerified: undefined,
      sessionExpireMsg: undefined,
    };
  }
}
