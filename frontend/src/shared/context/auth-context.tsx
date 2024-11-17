import React, {
  createContext,
  FC,
  useEffect,
  useState,
} from "react";
import { isLoggedIn as checkIsLoggedIn } from "shared/quick/auth-check";
import { useDispatch } from "react-redux";
import useUserData from "shared/hooks/user-data-hook";
import { userDataHandler } from "shared/utils/localStorageConfig/userDataHandler";
import { AppDispatch } from "shared/store";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";

const TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY;

interface AuthContextValue {
  clickedAuth: boolean;
  isOtpSend: boolean;
  isLoggedIn: boolean;
  authClickedHandler: (val: boolean) => void;
  login: (
    email: string,
    userId: string,
    token: string,
    tokenExpiration?: string,
    isEmailVerified?: boolean
  ) => void;
  logout: () => void;
}

//TODO: use redux for mangement and redux peristance for the same
export const AuthContext = createContext<AuthContextValue>({
  clickedAuth: false,
  isOtpSend: false,
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
  const [isOtpSend, setIsOtpSend] = useState<boolean>(false);
  const { isEmailVerified, token } = useUserData();
  const [clickedAuth, setClickedAuth] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setClickedAuth(!!(token && !isEmailVerified));
  }, [token, isEmailVerified]);

  useEffect(() => {
    if (sessionExpireMsg) {
      dispatch(triggerErrorMsg(sessionExpireMsg, 1000));
    }
  }, [sessionExpireMsg, dispatch]);

  const authClickedHandler = (val: boolean) => {
    setClickedAuth(val);
  };

  const login = (
    email?: string,
    userId?: string,
    token?: string,
    expirationDate?: string,
    isEmailVerified?: boolean
  ) => {
    if (!email && !userId && !token && isEmailVerified === undefined) return;
    const localEmailVerified = isEmailVerified ? "1" : "0";
    const newTokenExpirationDate = expirationDate
      ? new Date(expirationDate)
      : new Date(new Date().getTime() + 1000 * Number(TOKEN_EXPIRY)); 

    userDataHandler({
      email,
      userId,
      token,
      expiration: newTokenExpirationDate.toISOString(),
      isEmailVerified: localEmailVerified,
      sessionExpireMsg: undefined,
    });

    setLoggedIn(true);
    setIsOtpSend(true);
    if (isEmailVerified) {
      setClickedAuth(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    setClickedAuth(false);
    setLoggedIn(false);
  };

  const ctxValue: AuthContextValue = {
    clickedAuth,
    isOtpSend,
    authClickedHandler,
    isLoggedIn: loggedIn,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
};
