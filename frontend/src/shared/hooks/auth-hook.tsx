import { useCallback, useEffect, useState } from "react";

interface AuthData {
  userId: string;
  token: string;
  expiration: string;
}

const TOKEN_EXPIRY = process.env.REACT_APP_AUTH_TOKEN_EXPIRY;
const EXPIRE_MESSAGE = "Your session has expired. Please log in again.";

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
      const newTokenExpirationDate = expirationDate
        ? new Date(expirationDate)
        : new Date(new Date().getTime() + 1000 * Number(TOKEN_EXPIRY));
      setTokenExpirationDate(newTokenExpirationDate);
      userDataHandler(uid, token, newTokenExpirationDate.toISOString());
      removeSessionExpireMsg();
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
    removeSessionExpireMsg(); //coz, no need if you log out manually
    clearTimeout(logoutTimer);
  }, []);

  // Effect to handle automatic logout when the token expires
  useEffect(() => {
    const storedDataJSON = localStorage.getItem("userData");
    if (storedDataJSON) {
      const storedData: AuthData = JSON.parse(storedDataJSON);
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        login(storedData.userId, storedData.token, storedData.expiration);
      } else if (new Date(storedData.expiration) <= new Date()) {
        setSessionExpireMsg(EXPIRE_MESSAGE);
        logout();
      }
    }

    // Get expiration date directly from localStorage
    const expirationData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData") || "{}").expiration
      : null;

    const localExpirationDate = expirationData
      ? new Date(expirationData)
      : null;

    let logoutTimer: NodeJS.Timeout | null = null;
    const handleLogout = () => {
      logout();
      setSessionExpireMsg(EXPIRE_MESSAGE);
    };

    if (
      localExpirationDate instanceof Date &&
      !isNaN(localExpirationDate.getTime())
    ) {
      const remainingTime =
        localExpirationDate.getTime() - new Date().getTime();

      if (remainingTime <= 0) {
        handleLogout();
      } else {
        logoutTimer = setTimeout(handleLogout, remainingTime);
      }
    } else {
      clearTimeout(logoutTimer as unknown as NodeJS.Timeout);
    }
  }, []);

  return { token, userId, login, logout };
};

export default useAuth;

//local storage handling for the above purpose

function setSessionExpireMsg(sessionExpireMsg: string) {
  const workerDataJSON = localStorage.getItem("workerData");
  let workerData: { [key: string]: any } = {};

  if (workerDataJSON) {
    workerData = JSON.parse(workerDataJSON);
  }

  workerData.sessionExpireMsg = sessionExpireMsg;
  localStorage.setItem("workerData", JSON.stringify(workerData));
}

const removeSessionExpireMsg = () => {
  const workerDataJSON = localStorage.getItem("workerData");
  if (workerDataJSON) {
    const workerData = JSON.parse(workerDataJSON);
    delete workerData.sessionExpireMsg; // Remove the specific key-value pair
    localStorage.setItem("workerData", JSON.stringify(workerData));
  }
};

function userDataHandler(userId: string, token: string, expiration: string) {
  localStorage.setItem(
    "userData",
    JSON.stringify({
      userId,
      token,
      expiration,
    })
  );
}
