import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import { isLoggedIn as checkIsLoggedIn } from "shared/utilComponents/quick/auth-check";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import { userDataHandler } from "shared/utilComponents/localStorageConfig/userDataHandler";

const TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY;

interface AuthContextValue {
  clickedAuth: boolean;
  isLoggedIn: boolean;
  authClickedHandler: (val: boolean) => void;
  login: (
    email: string | undefined,
    userId: string | undefined,
    token: string | undefined,
    tokenExpiration?: string | undefined,
    isEmailVerified?: boolean | undefined
  ) => void;
  logout: () => void;
}

//todo: use context every where integrated with local storage except for path at index use localhost to make it wor

export const AuthContext = createContext<AuthContextValue>({
  clickedAuth: false,
  authClickedHandler: () => {},
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
  const [clickedAuth, setClickedAuth] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionExpireMsg) {
      dispatch(dataStatusUIAction.setResMsg(sessionExpireMsg));
    }
  }, [sessionExpireMsg, dispatch]);

  const authClickedHandler = (val: boolean) => {
    setClickedAuth(val);
  };

  const login = useCallback(
    (
      email?: string,
      userId?: string,
      token?: string,
      expirationDate?: string,
      isEmailVerified?: boolean
    ) => {
      console.log(
        email,
        userId,
        token,
        expirationDate,
        isEmailVerified
      );
      if (!email && !userId && !token && isEmailVerified ===undefined) return;

      const localEmailVerified = isEmailVerified ? "1" : "0";
      const newTokenExpirationDate = expirationDate
        ? new Date(expirationDate)
        : new Date(new Date().getTime() + 1000 * Number(TOKEN_EXPIRY)); //fallback if expiration not came

      console.log(
        email,
        userId,
        token,
        newTokenExpirationDate,
        isEmailVerified
      );
      userDataHandler({
        email,
        userId,
        token,
        expiration: newTokenExpirationDate.toISOString(),
        isEmailVerified: localEmailVerified,
        sessionExpireMsg: undefined,
      });

      setLoggedIn(true);
      setClickedAuth(false);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("userData");
    setLoggedIn(false);
  }, []);

  const ctxValue: AuthContextValue = {
    clickedAuth,
    authClickedHandler,
    isLoggedIn: loggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
