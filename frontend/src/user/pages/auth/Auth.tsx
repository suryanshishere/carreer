import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import AuthComponent from "user/components/auth/AuthComponent";
import EmailVerification from "user/components/auth/EmailVerification";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleAuthClick, logout } from "shared/store/auth-slice";
import { AppDispatch, RootState } from "shared/store";

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

interface ButtonConfig {
  text: string;
  onClick: () => void;
}

const Auth: React.FC<AuthProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [authState, setAuthState] = useState<AuthState>(AuthState.LOGIN);
  const { token, isEmailVerified } = useSelector(
    (state: RootState) => state.auth.userData
  );

  const handleStateChange = (newState: AuthState) => setAuthState(newState);

  const buttonsConfig: Record<AuthState, ButtonConfig[]> = {
    [AuthState.LOGIN]: token
      ? []
      : [
          {
            text: "Forgot Password?",
            onClick: () => handleStateChange(AuthState.FORGOT_PASSWORD),
          },
        ],

    [AuthState.FORGOT_PASSWORD]: [
      {
        text: "Login / Signup",
        onClick: () => handleStateChange(AuthState.LOGIN),
      },
    ],

    [AuthState.VERIFY_EMAIL]:
      token && !isEmailVerified
        ? [
            {
              text: "Logout",
              onClick: () => dispatch(logout()),
            },
          ]
        : [],
  };

  const renderButtons = () => (
    <div className="md:pl-4 gap-x-3 flex md:flex-col md:gap-[3px] items-start text-xs">
      {buttonsConfig[authState]?.map(({ text, onClick }, index) => (
        <button
          key={index}
          className={`hover:text-custom-less-red text-left ${
            (text === "Forgot Password?" || text === "Login / Signup") &&
            "text-custom-red"
          }`}
          onClick={onClick}
        >
          {text}
        </button>
      ))}
      <Link to="/contact-us" className="hover:text-custom-less-red">
        Need help?
      </Link>
      <button
        onClick={() => dispatch(handleAuthClick(false))}
        className="hover:text-custom-less-red"
      >
        Close
      </button>
    </div>
  );

  const renderComponents = () => {
    switch (authState) {
      case AuthState.FORGOT_PASSWORD:
        return (
          <ForgotPassword onBack={() => handleStateChange(AuthState.LOGIN)} />
        );
      case AuthState.VERIFY_EMAIL:
        return <EmailVerification />;
      default:
        return <AuthComponent />;
    }
  };

  return (
    <div className="w-full flex flex-col md:grid grid-cols-[85%_15%] gap-y-3">
      {renderComponents()}
      {renderButtons()}
    </div>
  );
};

export default Auth;
