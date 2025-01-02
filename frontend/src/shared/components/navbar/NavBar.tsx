import React from "react";
import Response from "shared/utils/api/Response";
import SubMain from "./subMain/SubMain";
import PersistMain from "./persistMain/PersistMain";
import Main from "./main/Main";
import NavBand from "./NavBand";

const NavBar: React.FC = () => {
  return (
    <div className="fixed w-full min-h-fit flex flex-col justify-center z-30">
      <Main />
      <PersistMain />
      <SubMain />
      <NavBand />
      <Response />
    </div>
  );
};

export default NavBar;
