import { IRole } from "models/admin/IAdmin";

export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  role?: IRole;
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
