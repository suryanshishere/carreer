import React, { useState } from "react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import ResetPassword from "../../components/auth/ResetPassword";
import Otp from "src/user/components/auth/Otp";
import AuthComponent from "src/user/components/auth/Auth";

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
  signupOTP?: () => void;
  timerForward?: (value: number) => void;
  signupDataForwardHandler?: (email: string, message: string) => void;
  timer?: number | undefined;
  signupData?: { email: string; message: string } | undefined;
  changePassword?: boolean;
  onMsg?: (value: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onClose }) => {
  const [authState, setAuthState] = useState(AuthState.LOGIN);
  const [resetTimer, setResetTimer] = useState<number>();
  const [signupData, setSignupData] = useState<{
    email: string;
    message: string;
  }>({
    email: "",
    message: "",
  });

  const clickedHandler = (newState: AuthState) => {
    setAuthState(newState);
  };

  const handleBackClick = () => {
    switch (authState) {
      case AuthState.FORGOT_PASSWORD:
        setAuthState(AuthState.LOGIN);
        break;
      case AuthState.RESET_PASSWORD:
        setAuthState(AuthState.FORGOT_PASSWORD);
        break;
      case AuthState.SIGNUP_OTP:
        setAuthState(AuthState.LOGIN);
        break;
      default:
        break;
    }
  };

  const signupDataForwardHandler = (email: string, message: string) => {
    setSignupData({ email, message });
  };

  const timerForwardhandler = (value: number) => {
    setResetTimer(value);
  };

  let authComponent;
  switch (authState) {
    case AuthState.FORGOT_PASSWORD:
      authComponent = (
        <ForgotPassword
          timerForward={timerForwardhandler}
          resetPasswordClicked={() => clickedHandler(AuthState.RESET_PASSWORD)}
          onBack={handleBackClick}
        />
      );
      break;
    case AuthState.RESET_PASSWORD:
      authComponent = (
        <ResetPassword
          timer={resetTimer}
          onBack={handleBackClick}
          onBackLogin={() => clickedHandler(AuthState.LOGIN)}
        />
      );
      break;
    case AuthState.SIGNUP_OTP:
      authComponent = (
        <Otp
          onBack={handleBackClick}
          onBackLogin={() => clickedHandler(AuthState.LOGIN)}
          onClose={onClose}
          signupData={signupData}
        />
      );
      break;
    default:
      authComponent = (
        <AuthComponent
          onClose={onClose}
          signupOTP={() => clickedHandler(AuthState.SIGNUP_OTP)}
          forgotPasswordClicked={() =>
            clickedHandler(AuthState.FORGOT_PASSWORD)
          }
          signupDataForwardHandler={signupDataForwardHandler}
        />
      );
  }

  return authComponent;
};

export default Auth;
