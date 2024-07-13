import { useCallback, useEffect, useState } from 'react';

interface AuthData {
  userId: string;
  token: string;
  expiration: string; // Keep expiration as string for initial storage
}

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<Date | null>(
    null
  );

  let logoutTimer: ReturnType<typeof setTimeout>;

  const login = useCallback(
    (uid: string, token: string, expirationDate?: string) => {
      setToken(token);
      setUserId(uid);
      const newTokenExpirationDate =
        expirationDate ? new Date(expirationDate) : new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(newTokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: newTokenExpirationDate.toISOString(),
        })
      );
      localStorage.removeItem('logoutMessage');
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData');
    localStorage.setItem(
      'logoutMessage',
      'Session expired, re-login to continue'
    );
    clearTimeout(logoutTimer);
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      if (remainingTime <= 0) {
        logout();
      } else {
        logoutTimer = setTimeout(logout, remainingTime);
      }
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedDataJSON = localStorage.getItem('userData');
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
          storedData.expiration // Pass expiration string as-is
        );
      } else if (new Date(storedData.expiration) <= new Date()) {
        localStorage.setItem(
          'logoutMessage',
          'Session expired, re-login to continue'
        );
        logout();
      }
    }
  }, [login, logout]);

  return { token, userId, login, logout };
};

export default useAuth;
