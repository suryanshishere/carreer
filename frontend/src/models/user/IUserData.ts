export interface IUserData {
  userId: string | undefined;
  token: string | undefined;
  expiration: string | undefined;
  emailVerified: string | undefined;
  sessionExpireMsg?: string | undefined;
}
