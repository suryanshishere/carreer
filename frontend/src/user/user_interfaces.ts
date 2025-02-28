import { IRole } from "models/admin/IAdmin";

export interface IUserAccountMode {
  max: boolean;
  tag: {
    live: boolean;
    upcoming: boolean;
    released: boolean;
    expiring: boolean;
    visited: boolean;
  };
}

export interface IUserData {
  token: string;
  isEmailVerified: boolean;
  role: IRole;
  mode: IUserAccountMode;
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
