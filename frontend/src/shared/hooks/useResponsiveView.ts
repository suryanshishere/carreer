import { useState, useEffect } from "react";

export type IView =
  | "mobile"
  | "medium_mobile"
  | "large_mobile"
  | "desktop"
  | "tablet"
  | "desktop_hd"
  | "other";

const useResponsiveView = (
  breakpoints = {
    mobile: 675,
    medium_mobile: 775,
    large_mobile: 910,
    tablet: 975,
    desktop: 1100,
    desktop_hd: 1250,
  }
) => {
  const getViewType = (): IView => {
    const width = window.innerWidth;

    if (width < breakpoints.mobile) return "mobile";
    if (width < breakpoints.medium_mobile) return "medium_mobile";
    if (width < breakpoints.large_mobile) return "large_mobile";
    if (width < breakpoints.tablet) return "tablet";
    if (width < breakpoints.desktop) return "desktop";
    if (width < breakpoints.desktop_hd) return "desktop_hd";
    return "desktop";
  };

  const [viewType, setViewType] = useState<IView>(getViewType);

  useEffect(() => {
    const updateView = () => setViewType(getViewType());

    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, [breakpoints]);

  return viewType;
};

export default useResponsiveView;
