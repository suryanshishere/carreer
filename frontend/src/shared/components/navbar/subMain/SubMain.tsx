import React from "react";
import useHandleScroll from "shared/hooks/sub-nav-scroll-hook";
import Navlinks from "./Navlinks";
import Tags from "./Tags";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();

  return (
    <>
      {showSubNav && (
        <div className="page-padding bg-custom-pale-yellow md:h-sub-nav py-2 text-base flex justify-center items-center gap-2">
          <Navlinks />
          <Tags />
        </div>
      )}
    </>
  );
};

export default SubMain;
