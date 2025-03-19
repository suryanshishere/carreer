import React from "react";
import Navlinks from "./Navlinks";
import NavTags from "./NavTags";
import useHandleScroll from "shared/hooks/handle-scroll-hook";
import useResponsiveView, { IView } from "shared/hooks/useResponsiveView";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();
  const viewType: IView = useResponsiveView();
  const { nav_tags, navlinks } = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );

  return (
    <div
      className={`z-20 page_padding bg-custom_pale_yellow text-base flex justify-center items-center gap-[.75rem] mobile:gap-3 
        transform transition-transform duration-300 ease-in-out ${
          viewType === "mobile" ? "h-sub_nav_sm" : "h-sub_nav"
        }
        ${
          showSubNav || nav_tags || navlinks
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
    >
      <Navlinks />
      <NavTags />
    </div>
  );
};

export default SubMain;
