import React from "react";
import Auth from "users/pages/auth/Auth";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ActivateAccount from "users/pages/account/ActivateAccount";
import Collapse from "@mui/material/Collapse";

const PersistMain: React.FC = () => {
  const { isNavAuthClicked, token, isEmailVerified, deactivatedAt } =
    useSelector((state: RootState) => state.user);

  const showAuth = isNavAuthClicked || (token && !isEmailVerified);
  const showActivateAccount = token && deactivatedAt;
  const shouldShow = !!(showAuth || showActivateAccount);

  return (
    <Collapse in={shouldShow} timeout="auto" unmountOnExit>
      <div className="z-20 relative h-fit py-2 bg-custom_white">
        <div className="outline-custom_gray py-3 outline-dashed page_padding">
          {(showActivateAccount && <ActivateAccount />) ||
            (showAuth && <Auth />)}
        </div>
      </div>
    </Collapse>
  );
};

export default PersistMain;
