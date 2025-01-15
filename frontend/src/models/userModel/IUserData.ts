import { IRole } from "models/admin/IAdmin";

 export interface IUserAccountMode {
  max?: boolean;
 }

export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  role?: IRole;
  mode?: IUserAccountMode;
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}
