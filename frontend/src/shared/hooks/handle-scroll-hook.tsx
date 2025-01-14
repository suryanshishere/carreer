import { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";

const useHandleScroll = () => {
  const [showSubNav, setShowSubNav] = useState(true);
  const lastScrollY = useRef(0); // Use ref to avoid re-renders when updating

  // Throttled scroll handler
  const handleScroll = throttle(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setShowSubNav(true);
    } else if (currentScrollY > lastScrollY.current) {
      // Scrolling down
      setShowSubNav(false);
    }

    lastScrollY.current = currentScrollY;
  }, 200);

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup: remove event listener and cancel throttle
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel(); // Cancel the throttled function
    };
  }, [handleScroll]);

  return showSubNav;
};

export default useHandleScroll;
