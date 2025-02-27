import SHARED_DB from "shared/shared_db";
import { ReactNode } from "react";

interface UserAccountModeDB {
  max_mode_off_confirm: ReactNode;
}

export const USER_ACCOUNT_MODE_DB: UserAccountModeDB = {
  max_mode_off_confirm: (
    <>
      <p>
        Are you sure you want to <mark>turn off</mark> max mode? All max mode
        benefits will be turned off, such as direct links and dates will not be
        displayed in the section view like result, admit card etc.
      </p>
    </>
  ),
};

export const CONTRIBUTER_DB = {
  status: SHARED_DB.status,
  status_classname: SHARED_DB.status_classname,
};
