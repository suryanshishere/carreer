import SHARED_DB from "shared/shared-db";
import { ReactNode } from "react";
import { IRole } from "admin/admin-db";

interface ITagItem {
  color: string;
  label: string;
  daysRange: [number, number];
}

interface IUserAccountModeDB {
  max_mode_off_confirm: ReactNode;
  tags: {
    live: ITagItem;
    upcoming: ITagItem;
    released: ITagItem;
    expiring: ITagItem;
    visited: {
      color: string;
      label: string;
      daysRange?: [number, number];
    };
  };
}

export const USER_ACCOUNT_MODE_DB: IUserAccountModeDB = {
  max_mode_off_confirm: (
    <>
      <p>
        Are you sure you want to <mark>turn off</mark> max mode? All max mode
        benefits will be turned off, such as direct links and dates will not be
        displayed in the section view like result, admit card etc.
      </p>
    </>
  ),
  tags: {
    live: { color: "custom_green", label: "LIVE", daysRange: [-3, 2] },
    upcoming: {
      color: "custom_pale_orange",
      label: "UPCOMING",
      daysRange: [3, 80],
    },
    released: { color: "custom_gray", label: "RELEASED", daysRange: [-80, -4] },
    expiring: {
      color: "custom_red animate-pulse",
      label: "EXPIRING",
      daysRange: [2000, 3000],
    },
    visited: { color: "custom_black", label: "VISITED" },
  },
};

export const CONTRIBUTER_DB = {
  status: SHARED_DB.status,
  status_classname: SHARED_DB.status_classname,
};

export interface IUserAccountMode {
  max: boolean;
  tags: {
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
  deactivatedAt?: string;
  tokenExpiration?: string;
  sessionExpireMsg?: string;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export interface INavAccountListItem {
  role?: string[] | string;
  link: string;
}

export interface INavAccountSetting {
  change_password: INavAccountListItem;
  forgot_password: INavAccountListItem;
  deactivate_account: INavAccountListItem;
}

export interface INavAccountList {
  create_new_post: INavAccountListItem;
  my_contribution: INavAccountListItem;
  setting: INavAccountSetting;
  logout: null;
}

// This type represents either the full account list or a nested section (like "setting").
export type INavAccountData = INavAccountList | INavAccountSetting;

export const NAV_ACCOUNT_LIST: INavAccountList = {
  create_new_post: {
    role: ["publisher", "admin"],
    link: "/publisher/create-new-post",
  },
  my_contribution: {
    link: "/user/account/my-contribution",
  },
  setting: {
    change_password: { link: "/user/account/setting/change-password" },
    forgot_password: { link: "/user/account/setting/forgot-password" },
    deactivate_account: { link: "/user/account/setting/deactivate-account" },
  },
  logout: null,
};
