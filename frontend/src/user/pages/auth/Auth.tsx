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
  onBack?: () => void;
  onBackLogin?: () => void;
  forgotPasswordClicked?: () => void;
  signupDataForwardHandler?: (email: string, message: string) => void;
  classProp?: string;
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

  let components: React.ReactNode;

  if (authState === AuthState.FORGOT_PASSWORD) {
    components = (
      <ForgotPassword
        onBack={handleBackClick}
        classProp="h-5/6 flex-1 flex items-center gap-2 justify-end"
      />
    );
  } else if (token && !isEmailVerified) {
    components = <EmailVerification />;
  } else {
    components = <AuthComponent />;
  }

  return (
    <div className="w-full grid grid-cols-[85%_15%] items-center">
      {components}
      <div className="pl-8">
        {authState === AuthState.LOGIN && !token && (
          <>
            <Button
              style={{ cursor: "default" }}
              classProp="text-custom-red hover:text-custom-less-red p-0 m-0 text-sm"
              onClick={() => handleStateChange(AuthState.FORGOT_PASSWORD)}
            >
              Forgot Password?
            </Button>
            <Button
              style={{ cursor: "default" }}
              classProp="hover:text-custom-less-red p-0 m-0 text-xs"
            >
              Need help?
            </Button>
            <Button
              style={{ cursor: "default" }}
              onClick={() => auth.authClickedHandler(false)}
              classProp="hover:text-custom-less-red p-0 m-0 text-xs"
            >
              Close
            </Button>
          </>
        )}
        {authState === AuthState.FORGOT_PASSWORD && (
          <>
            <Button
              style={{ cursor: "default" }}
              classProp="text-custom-red hover:text-custom-less-red p-0 m-0 text-sm"
              type="button"
              onClick={handleBackClick}
            >
              Login / Signup
            </Button>
            <Button
              style={{ cursor: "default" }}
              classProp="hover:text-custom-less-red p-0 m-0 text-xs"
              type="button"
            >
              Need help?
            </Button>
            <Button
              style={{ cursor: "default" }}
              onClick={() => auth.authClickedHandler(false)}
              classProp="hover:text-custom-less-red p-0 m-0 text-xs"
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
              classProp="hover:text-custom-less-red p-0 m-0 text-xs"
            >
              Need help?
            </Button>
            <Button
              style={{ cursor: "default" }}
              classProp="hover:text-custom-less-red p-0 m-0 ml-auto text-xs"
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
