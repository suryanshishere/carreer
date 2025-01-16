import { useState, useEffect } from "react";

export type ViewType = "mobile" | "desktop" | "tablet" | "other";

const useResponsiveView = (breakpoints = { mobile: 768, tablet: 1024 }) => {
  const [viewType, setViewType] = useState<ViewType>("other");

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;

      if (width < breakpoints.mobile) {
        setViewType("mobile");
      } else if (width < breakpoints.tablet) {
        setViewType("tablet");
      } else {
        setViewType("desktop");
      }
    };

    // Initial check
    updateView();

    // Add resize event listener
    window.addEventListener("resize", updateView);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateView);
  }, [breakpoints]);

  return viewType;
};

export default useResponsiveView;
