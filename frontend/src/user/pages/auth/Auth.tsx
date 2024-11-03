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

const Auth: React.FC<AuthProps> = () => {
  const auth = useContext(AuthContext);
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);
  const { isEmailVerified, token } = useUserData();

  const handleStateChange = (newState: AuthState) => {
    setAuthState(newState);
  };

  const handleBackClick = () => {
    if (authState === AuthState.FORGOT_PASSWORD) {
      setAuthState(AuthState.LOGIN);
    }
  };

  let components;

  if (authState === AuthState.FORGOT_PASSWORD) {
    components = <ForgotPassword onBack={handleBackClick} />;
  } else if (token && !isEmailVerified) {
    components = <EmailVerification />;
  } else {
    components = <AuthComponent />;
  }

  return (
    <div className="w-full grid grid-cols-[85%_15%] items-center">
      {components}
      <div className="pl-8 text-xs">
        {authState === AuthState.LOGIN && !token && (
          <>
            <Button
              style={{ cursor: "default" }}
              classProp=" text-custom-red hover:text-custom-less-red p-0 m-0"
              onClick={() => handleStateChange(AuthState.FORGOT_PASSWORD)}
            >
              Forgot Password?
            </Button>
            <Button
              style={{ cursor: "default" }}
              classProp="hover:text-custom-less-red p-0 m-0"
            >
              Need help?
            </Button>
            <Button
              style={{ cursor: "default" }}
              onClick={() => auth.authClickedHandler(false)}
              classProp="hover:text-custom-less-red p-0 m-0"
            >
              Close
            </Button>
          </>
        )}
        {authState === AuthState.FORGOT_PASSWORD && (
          <>
            <Button
              style={{ cursor: "default" }}
              classProp=" text-custom-red hover:text-custom-less-red p-0 m-0"
              type="button"
              onClick={handleBackClick}
            >
              Login / Signup
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
          </>
        )}
        {token && !isEmailVerified && (
          <>
            <Button
              style={{ cursor: "default" }}
              classProp="hover:text-custom-less-red p-0 m-0"
            >
              Need help?
            </Button>
            <Button
              style={{ cursor: "default" }}
              classProp=" hover:text-custom-less-red p-0 m-0 ml-auto"
              onClick={() => auth.logout()}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
