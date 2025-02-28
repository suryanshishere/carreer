import SHARED_DB from "shared/shared_db";
import { ReactNode } from "react";

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
