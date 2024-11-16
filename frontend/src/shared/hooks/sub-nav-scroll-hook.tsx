import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import { throttle } from "lodash";

// TypeScript function to handle scroll
const useHandleScroll = () => {
  const [showSubNav, setShowSubNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(
    throttle(() => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY) {
        // Scrolling up and no error/response message
        setShowSubNav(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down and no error/response message
        setShowSubNav(false);
      }
      setLastScrollY(currentScrollY);
    }, 200), // Throttle the function to execute at most once every 200ms
    [lastScrollY]
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
