import { IUserData } from "models/user/IUserData";

export function userDataHandler(
  userId: string,
  token: string,
  expiration: string,
  emailVerified: string,
  sessionExpireMsg?: string
): void {
  const data: IUserData = {
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
