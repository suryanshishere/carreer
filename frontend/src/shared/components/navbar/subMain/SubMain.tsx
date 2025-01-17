import React from "react"; 
import Navlinks from "./Navlinks";
import Tags from "./Tags";
import useHandleScroll from "shared/hooks/handle-scroll-hook";

const SubMain: React.FC = () => {
  const showSubNav = useHandleScroll();

  return (
    <div
      className={`z-20 page-padding bg-custom-pale-yellow md:h-sub-nav py-2 text-base flex justify-center items-center gap-2 
        transform transition-transform duration-300 ease-in-out
        ${showSubNav ? "translate-y-0" : "-translate-y-full"}`}
    >
      <Navlinks />
      <Tags />
    </div>
  );
};

export default SubMain;
