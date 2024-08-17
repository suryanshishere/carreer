export interface IUserData {
  email: string | undefined;
  userId: string | undefined;
  token: string | undefined;
  expiration: string | undefined;
  emailVerified: string | undefined;
  sessionExpireMsg?: string | undefined;
}
