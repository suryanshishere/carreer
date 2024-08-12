import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/utilComponents/store";

// Throttle function with proper type annotations
export const throttle = (callback: (...args: any[]) => void, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
};

// TypeScript function to handle scroll
const useHandleScroll = () => {
  const [showSubNav, setShowSubNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const error = useSelector((state: RootState) => state.dataStatus.error);
  const resMsg = useSelector((state: RootState) => state.dataStatus.resMsg);


  const handleScroll = useCallback(
    throttle(() => {
      const currentScrollY = window.scrollY;
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 50 &&
        !error &&
        !resMsg
      ) {
        // Scrolling down and no error/response message
        setShowSubNav(false);
      } else {
        // Scrolling up or there is an error/response message
        setShowSubNav(true);
      }
      setLastScrollY(currentScrollY);
    }, 200), // Throttle the function to execute at most once every 200ms
    [lastScrollY, error, resMsg]
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return showSubNav;
};

export default useHandleScroll;
