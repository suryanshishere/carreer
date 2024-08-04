import React, { useState } from "react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import ResetPassword from "../../components/auth/ResetPassword";
import AuthComponent from "user/components/auth/Auth";

enum AuthState {
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  SIGNUP_OTP,
}

export interface AuthProps {
  onClose?: () => void;
  onBack?: () => void;
  onBackLogin?: () => void;
  forgotPasswordClicked?: () => void;
  resetPasswordClicked?: () => void;
  signupDataForwardHandler?: (email: string, message: string) => void;
  changePassword?: boolean;
  onMsg?: (value: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [authState, setAuthState] = useState(AuthState.LOGIN);

  const clickedHandler = (newState: AuthState) => {
    setAuthState(newState);
  };

  const handleBackClick = () => {
    switch (authState) {
      case AuthState.FORGOT_PASSWORD:
        setAuthState(AuthState.LOGIN);
        break;
      default:
        break;
    }
  };

  let authComponent;
  switch (authState) {
    case AuthState.FORGOT_PASSWORD:
      authComponent = (
        <ForgotPassword
          resetPasswordClicked={() => clickedHandler(AuthState.RESET_PASSWORD)}
          onBack={handleBackClick}
        />
      );
      break;
    default:
      authComponent = (
        <AuthComponent
          onClose={onClose}
          forgotPasswordClicked={() =>
            clickedHandler(AuthState.FORGOT_PASSWORD)
          }
        />
      );
  }

  return authComponent;
};

export default Auth;
