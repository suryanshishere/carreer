import React, { createContext, FC, useState } from "react";
import useAuth from "../hooks/auth-hook";

interface AuthContextValue {
  showAuth: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (userId: string, token: string, tokenExpiration: string) => void;
  logout: () => void;
  showAuthHandler: (value: boolean) => void;
  logoutAndRefresh: () => void;
  loginAndRefresh: (
    userId: string,
    token: string,
    tokenExpiration: string
  ) => void;
}

export const AuthContext = createContext<AuthContextValue>({
  showAuth: false,
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
  showAuthHandler: () => {},
  logoutAndRefresh: () => {},
  loginAndRefresh: () => {},
});

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const { token, login, logout, userId } = useAuth();
  const [showAuth, setShowAuth] = useState<boolean>(false);

  const showAuthHandler = (value: boolean) => {
    setShowAuth(value);
  };

  const loginHandler = (
    userId: string,
    token: string,
    tokenExpiration: string
  ) => {
    login(userId, token, tokenExpiration);
  };

  const logoutHandler = () => {
    logout();
  };

  const loginAndRefresh = (
    userId: string,
    token: string,
    tokenExpiration: string
  ) => {
    login(userId, token, tokenExpiration);
    window.location.reload();
  };

  const logoutAndRefresh = () => {
    logout();
    window.location.reload();
  };

  const ctxValue: AuthContextValue = {
    showAuth,
    isLoggedIn: !!token,
    token,
    userId,
    login: loginHandler,
    logout: logoutHandler,
    showAuthHandler,
    loginAndRefresh,
    logoutAndRefresh,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
