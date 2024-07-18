import React, { createContext, FC, useCallback, useState } from "react";
import { isLoggedIn as checkIsLoggedIn } from "shared/helpers/auth-check";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import useUserData from "shared/localStorageConfig/userData-hook";
import { userDataHandler } from "shared/localStorageConfig/auth-local-storage";

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
  const { sessionExpireMsg } = useUserData();
  const [loggedIn, setLoggedIn] = useState<boolean>(checkIsLoggedIn());
  const dispatch = useDispatch();

  if (sessionExpireMsg) {
    dispatch(responseUIAction.setResponseHandler(sessionExpireMsg));
  }

  const login = useCallback(
    (
      uid: string | undefined,
      token: string | undefined,
      expirationDate?: string | undefined,
      emailVerified?: boolean | undefined
    ) => {
      if (
        token === undefined ||
        expirationDate === undefined ||
        uid === undefined
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

      setLoggedIn(true);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    setLoggedIn(false);
  }, []);

  const ctxValue: AuthContextValue = {
    isLoggedIn: loggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
