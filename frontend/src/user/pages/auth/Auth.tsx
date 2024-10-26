import React, { useState } from "react";
import ForgotPassword from "../../components/auth/ForgotPassword";
import AuthComponent from "user/components/auth/Auth";

enum AuthState {
  LOGIN,
  FORGOT_PASSWORD,
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
  }

  return (
    <AuthComponent
      onClose={onClose}
      forgotPasswordClicked={() => handleStateChange(AuthState.FORGOT_PASSWORD)}
    />
  );
};

export default Auth;
