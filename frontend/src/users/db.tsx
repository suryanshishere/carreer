import SHARED_DB from "shared/db";
import { ReactNode } from "react";
import { IRole } from "admin/db";
import { logout } from "shared/store/userSlice";
import {
  closeAllDropdowns,
  toggleDropdownState,
} from "shared/store/dropdownSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "shared/store";

export type ITagKey = "live" | "upcoming" | "released" | "expiring" | "none";

export const TAGS: Record<ITagKey, string | null> = {
  live: "custom_green",
  upcoming: "custom_pale_orange",
  released: "custom_gray",
  expiring: "custom_red animate-pulse",
  none: null,
};

interface IUserAccountModeDB {
  max_mode_off_confirm: ReactNode;
  tags: Record<ITagKey, string | null>;
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
  tags: TAGS,
};

export const CONTRIBUTER_DB = {
  status: SHARED_DB.status,
  status_classname: SHARED_DB.status_classname,
};

export interface IUserAccountMode {
  max: boolean;
  tags: Record<ITagKey, boolean>;
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

// ---------------------------- nav account dropdown db

export interface INavAccountListItem {
  role?: string[] | string;
  link?: string;
  func?: () => void;
}

export interface INavAccountSetting {
  data: {
    change_password: INavAccountListItem;
    forgot_password: INavAccountListItem;
    deactivate_account: INavAccountListItem;
  };
  func: () => void;
}

export interface INavAccountList {
  create_new_post: INavAccountListItem;
  my_contribution: INavAccountListItem;
  contributions: INavAccountListItem;
  non_approved_posts: INavAccountListItem;
  access: INavAccountListItem;
  setting: INavAccountSetting;
  revoke_access: null;
  logout: INavAccountListItem;
}

export type INavAccountData = INavAccountList | INavAccountSetting;

/**
 * Custom hook to retrieve the navigation account list.
 *
 * @param keyProp Optional key name from the nav list. If provided, returns an object
 * with that key and its corresponding value. Otherwise, returns the full map.
 */
export function useNavAccountList<T extends keyof INavAccountList>(
  keyProp?: T
): T extends undefined ? INavAccountList : { [K in T]: INavAccountList[K] } {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Full navigation list.
  const navList: INavAccountList = {
    create_new_post: {
      role: ["publisher", "admin"],
      link: "/publisher/create-new-post",
    },
    my_contribution: {
      link: "/user/account/my-contribution",
    },
    contributions: {
      role: ["admin", "approver"],
      link: "/approver/contributions-section",
    },
    non_approved_posts: {
      role: ["admin", "approver"],
      link: "/approver/non-approved-posts",
    },
    access: {
      role: ["admin"],
      link: "/admin/access",
    },
    revoke_access: null,
    setting: {
      data: {
        change_password: { link: "/user/account/setting/change-password" },
        forgot_password: { link: "/user/account/setting/forgot-password" },
        deactivate_account: {
          link: "/user/account/setting/deactivate-account",
        },
      },
      func: () => {
        dispatch(toggleDropdownState({ id: "setting" }));
      },
    },
    logout: {
      func: () => {
        dispatch(logout());
        dispatch(closeAllDropdowns());
        navigate("/");
      },
    },
  };

  if (keyProp) {
    const item = navList[keyProp];

    if (typeof item === "object" && item !== null && "data" in item) {
      return item.data as any; // Return only the `data` object if it exists.
    }
  }

  return navList as any;
}
