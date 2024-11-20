export interface IUserData {
  email: string;
  userId: string;
  token: string;
  isEmailVerified: boolean;
  navAccountDp?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
