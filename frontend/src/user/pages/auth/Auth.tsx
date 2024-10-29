import React, { useContext, useState } from "react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import AuthComponent from "user/components/auth/AuthComponent";
import Button from "shared/utilComponents/form/Button";
import { AuthContext } from "shared/utilComponents/context/auth-context";
import EmailVerification from "user/components/auth/EmailVerification";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

enum AuthState {
  LOGIN,
  FORGOT_PASSWORD,
  VERIFY_EMAIL,
}

export interface AuthProps {
  onClose?: () => void;
  onBack?: () => void;
  onBackLogin?: () => void;
  forgotPasswordClicked?: () => void;
  signupDataForwardHandler?: (email: string, message: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);
  const auth = useContext(AuthContext);
  const {isEmailVerified, token} = useUserData();

  const handleStateChange = (newState: AuthState) => {
    setAuthState(newState);
  };

  const handleBackClick = () => {
    if (authState === AuthState.FORGOT_PASSWORD) {
      setAuthState(AuthState.LOGIN);
    }
  };

  if (authState === AuthState.FORGOT_PASSWORD) {
    return <ForgotPassword onBack={handleBackClick} />;
  } else if (token && !isEmailVerified) {
    return <EmailVerification/>;
  }

  return (
    <>
      {/* <div className="flex-1 flex gap-1 items-center"> */}
      <AuthComponent onClose={onClose} />
      {/* </div> */}
      <div className="text-xs w-auto list-inside list-disc">
        <Button
          style={{ cursor: "default" }}
          classProp=" text-custom-red hover:text-custom-less-red p-0 m-0"
          type="button"
          onClick={() => handleStateChange(AuthState.FORGOT_PASSWORD)}
        >
          Forgot Password?
        </Button>
        <Button
          style={{ cursor: "default" }}
          classProp="hover:text-custom-less-red p-0 m-0"
          type="button"
        >
          Need help?
        </Button>
        <Button
          style={{ cursor: "default" }}
          onClick={() => auth.authClickedHandler(false)}
          classProp="hover:text-custom-less-red p-0 m-0"
          type="button"
        >
          Close
        </Button>
      </div>
    </>
  );
};

export default Auth;
