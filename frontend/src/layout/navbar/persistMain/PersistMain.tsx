import Auth from "users/pages/auth/Auth";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import ActivateAccount from "users/pages/account/ActivateAccount";

const PersistMain = () => {
  const { isNavAuthClicked, token, isEmailVerified, deactivatedAt } =
    useSelector((state: RootState) => state.user);

  const showAuth = isNavAuthClicked || (token && !isEmailVerified);
  const showActivateAccount = token && deactivatedAt;

  if (!showAuth && !showActivateAccount) return null;

  return (
    <div className="z-30 relative h-fit py-2 bg-custom_white">
      <div className="outline-custom_gray py-3 outline-dashed page_padding">
        {showAuth && <Auth />}
        {showActivateAccount && <ActivateAccount />}
      </div>
    </div>
  );
};

export default PersistMain;
