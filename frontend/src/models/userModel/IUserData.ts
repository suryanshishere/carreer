export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  role?:string;
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
