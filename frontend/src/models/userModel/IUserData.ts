export interface IUserData {
  email?: string | undefined ;
  userId?: string | undefined;
  token?: string | undefined;
  expiration?: string | undefined;
  isEmailVerified?: string | boolean | undefined;
  sessionExpireMsg?: string | undefined;
}
