import Auth from "user/pages/auth/Auth";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ActivateAccount from "user/pages/account/ActivateAccount";

const PersistMain = () => {
  const { isNavAuthClicked, userData } = useSelector(
    (state: RootState) => state.auth
  );
  const { token, isEmailVerified, deactivatedAt } = userData;
  const persistClassProp = `relative page-padding h-fit py-2 bg-custom-yellow z-20 shadow `;

  return (
    <>
      {(isNavAuthClicked || (token && !isEmailVerified)) && (
        <div className={persistClassProp}>
          <Auth />
        </div>
      )}
      {token && deactivatedAt && (
        <div className={persistClassProp}>
          <ActivateAccount />
        </div>
      )}
    </>
  );
};

export default PersistMain;
