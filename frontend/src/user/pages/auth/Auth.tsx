import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import AuthComponent from "user/components/auth/AuthComponent";
import Button from "shared/utils/form/Button";
import EmailVerification from "user/components/auth/EmailVerification";
import { AppDispatch, RootState } from "shared/store";
import { useDispatch, useSelector } from "react-redux";
import { handleAuthClick, logout } from "shared/store/auth-slice";
import { Link } from "react-router-dom";

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
  const dispatch = useDispatch<AppDispatch>();
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);
  const { token, isEmailVerified } = useSelector(
    (state: RootState) => state.auth.userData
  );
  const handleStateChange = (newState: AuthState) => setAuthState(newState);

  const renderButtons = () => {
    const needHelpLink = (
      <Link
        to="/contact-us"
        className="hover:text-custom-less-red p-0 m-0 text-xs"
      >
        Need help?
      </Link>
    );

    const closeButton = (
      <button
        onClick={() => dispatch(handleAuthClick(false))}
        className="hover:text-custom-less-red p-0 m-0 text-xs"
      >
        Close
      </button>
    );

    if (authState === AuthState.LOGIN && !token) {
      return (
        <>
          <button
            className="text-custom-red hover:text-custom-less-red p-0 m-0 text-xs"
            onClick={() => handleStateChange(AuthState.FORGOT_PASSWORD)}
          >
            Forgot Password?
          </button>
          {needHelpLink}
          {closeButton}
        </>
      );
    }

    if (authState === AuthState.FORGOT_PASSWORD) {
      return (
        <>
          <button
            className="text-custom-red hover:text-custom-less-red p-0 m-0 text-xs"
            type="button"
            onClick={() => handleStateChange(AuthState.LOGIN)}
          >
            Login / Signup
          </button>
          {needHelpLink}
          {closeButton}
        </>
      );
    }

    if (token && !isEmailVerified) {
      return (
        <>
          {needHelpLink}
          <button
            className="hover:text-custom-less-red p-0 m-0 ml-auto text-xs"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </>
      );
    }
  };

  const renderComponents = () => {
    if (authState === AuthState.FORGOT_PASSWORD) {
      return (
        <ForgotPassword
          onBack={() => handleStateChange(AuthState.LOGIN)}
          classProp="h-5/6 flex-1 flex items-center gap-2 justify-end"
        />
      );
    }

    if (token && !isEmailVerified) {
      return <EmailVerification />;
    }

    return <AuthComponent />;
  };

  return (
    <div className="w-full grid grid-cols-[85%_15%] items-center">
      {renderComponents()}
      <div className="pl-8 flex flex-col gap-[3px] items-start">
        {renderButtons()}
      </div>
    </div>
  );
};

export default Auth;
