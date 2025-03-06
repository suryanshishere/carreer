import { useState, useEffect } from "react";

export type ViewType =
  | "mobile"
  | "medium_mobile"
  | "large_mobile"
  | "desktop"
  | "tablet"
  | "extra_large"
  | "other";

export const viewObject = {
  mobile: 610,
  medium_mobile: 710,
  large_mobile: 1050,
  tablet: 1200,
  desktop: 1440,
};

const useResponsiveView = (
  breakpoints = {
    mobile: 610,
    medium_mobile: 710,
    large_mobile: 1050,
    tablet: 1024,
    desktop: 1440,
  } //default
) => {
  const [viewType, setViewType] = useState<ViewType>("other");

  useEffect(() => {
    const updateView = () => {
      const width = window.innerWidth;

      if (width < breakpoints.mobile) {
        setViewType("mobile");
      } else if (width < breakpoints.medium_mobile) {
        setViewType("medium_mobile");
      } else if (width < breakpoints.large_mobile) {
        setViewType("large_mobile");
      } else if (width < breakpoints.tablet) {
        setViewType("tablet");
      } else if (width < breakpoints.desktop) {
        setViewType("desktop");
      } else {
        setViewType("extra_large");
      }
    };

    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, [breakpoints]);

  return viewType;
};

export default useResponsiveView;
