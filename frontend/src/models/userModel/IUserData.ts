import { IRole } from "models/admin/IAdmin";

export type userAccountModeType = "max";

export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  role?: IRole;
  mode?: userAccountModeType[];
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
