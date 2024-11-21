export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
