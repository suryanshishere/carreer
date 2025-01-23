import React from "react";
import Navlinks from "./Navlinks";
import Tags from "./Tags";
import useHandleScroll from "shared/hooks/handle-scroll-hook";
import useResponsiveView, { viewObject, ViewType } from "shared/hooks/responsive-view-hook";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();

  const viewType: ViewType = useResponsiveView(viewObject);

  return (
    <div
      className={`z-20 page-padding bg-custom-pale-yellow text-base flex justify-center items-center gap-3 
        transform transition-transform duration-300 ease-in-out ${viewType === "tablet" || viewType === "mobile" ? "h-sub-nav-sm" : "h-sub-nav"}
        ${showSubNav ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Navlinks />
      <Tags />
    </div>
  );
};

export default SubMain;
