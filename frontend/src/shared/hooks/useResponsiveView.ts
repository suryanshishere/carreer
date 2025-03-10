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
  }
) => {
  const getViewType = (): ViewType => {
    const width = window.innerWidth;

    if (width < breakpoints.mobile) return "mobile";
    if (width < breakpoints.medium_mobile) return "medium_mobile";
    if (width < breakpoints.large_mobile) return "large_mobile";
    if (width < breakpoints.tablet) return "tablet";
    if (width < breakpoints.desktop) return "desktop";
    return "extra_large";
  };

  const [viewType, setViewType] = useState<ViewType>(getViewType);

  useEffect(() => {
    const updateView = () => setViewType(getViewType());

    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, [breakpoints]);

  return viewType;
};

export default useResponsiveView;
