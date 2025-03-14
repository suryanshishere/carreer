import React from "react";
import Navlinks from "./Navlinks";
import NavTags from "./NavTags";
import useHandleScroll from "shared/hooks/handle-scroll-hook";
import useResponsiveView, {
  viewObject,
  ViewType,
} from "shared/hooks/useResponsiveView";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();
  const viewType: ViewType = useResponsiveView(viewObject);

  return (
    <div
      className={`z-20 page-padding bg-custom_pale_yellow text-base flex justify-center items-center gap-3 
        transform transition-transform duration-300 ease-in-out ${
          viewType === "mobile" ? "h-sub_nav_sm" : "h-sub_nav"
        }
        ${showSubNav ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Navlinks />
      <NavTags />
    </div>
  );
};

export default SubMain;
