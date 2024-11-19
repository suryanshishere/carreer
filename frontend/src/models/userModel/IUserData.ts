export interface IUserData {
  email: string;
  userId: string;
  token: string;
  isEmailVerified: boolean;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
