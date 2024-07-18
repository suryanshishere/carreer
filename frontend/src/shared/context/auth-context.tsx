import React, { createContext, FC, useCallback, useState } from "react";
import { userDataHandler } from "shared/localStorageConfig/auth-local-storage";
import { isLoggedIn } from "shared/helpers/auth-check";

const TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY;

interface AuthContextValue {
  isLoggedIn: boolean;
  login: (
    userId: string | undefined,
    token: string | undefined,
    tokenExpiration?: string | undefined,
    emailVerified?: boolean | undefined
  ) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({
  children,
}) => {
  const login = useCallback(
    (
      uid: string | undefined,
      token: string | undefined,
      expirationDate?: string | undefined,
      emailVerified?: boolean | undefined
    ) => {
      //Just checking if it's undefined (so that we not need to elsewhere everytime)
      if (
        token === undefined ||
        expirationDate === undefined ||
        uid === undefined ||
        expirationDate === undefined
      )
        return;

      const localEmailVerified = emailVerified ? "1" : "0";
      const newTokenExpirationDate = expirationDate
        ? new Date(expirationDate)
        : new Date(new Date().getTime() + 1000 * Number(TOKEN_EXPIRY));
      userDataHandler(
        uid,
        token,
        newTokenExpirationDate.toISOString(),
        localEmailVerified
      );
    },
    []
  );

  const logout = useCallback(() => {
    //completely remove data related to user for the better user experience.
    localStorage.removeItem("userData");
  }, []);

  const ctxValue: AuthContextValue = {
    isLoggedIn: isLoggedIn(),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
