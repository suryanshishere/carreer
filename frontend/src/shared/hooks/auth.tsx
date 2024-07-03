import { useState, useCallback, useEffect } from "react";

let logoutTimer: NodeJS.Timeout;

interface AuthData {
  userId: string;
  token: string;
  expiration: string;
}

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);

  const login = useCallback(
    (uid: string, token: string, expirationDate?: Date) => {
      setToken(token);
      setUserId(uid);
      const newTokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(newTokenExpirationDate);
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: newTokenExpirationDate.toISOString(),
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
    clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedDataJSON = localStorage.getItem("userData");
    if (storedDataJSON) {
      const storedData: AuthData = JSON.parse(storedDataJSON);
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        login(
          storedData.userId,
          storedData.token,
          new Date(storedData.expiration)
        );
      }
    }
  }, [login]);

  return { token, login, logout, userId };
};
