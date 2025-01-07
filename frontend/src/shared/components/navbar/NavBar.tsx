import React from "react";
import Response from "shared/utils/api/Response";
import SubMain from "./subMain/SubMain";
import PersistMain from "./persistMain/PersistMain";
import Main from "./main/Main";

const NavBar: React.FC = () => {
  return (
    <div className="fixed w-full z-30">
      <Main />
      <PersistMain />
      <SubMain />
      <Response />
    </div>
  );
};

export default NavBar;
