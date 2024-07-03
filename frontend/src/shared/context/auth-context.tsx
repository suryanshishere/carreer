import React, { createContext, FC, useState } from "react";
import { useAuth } from "../hooks/auth";

interface AuthContextValue {
  showAuth: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  login: (token: string, userId: string) => void;
  logout: () => void;
  showAuthHandler: (value: boolean) => void;
  logoutAndRefresh: () => void;
  loginAndRefresh: (token: string, userId: string) => void;
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

  const loginHandler = (token: string, userId: string) => {
    login(token, userId);
  };

  const logoutHandler = () => {
    logout();
  };

  const loginAndRefresh = (token: string, userId: string) => {
    login(token, userId);
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
