import React from "react";
import SubMain from "./subMain/SubMain";
import PersistMain from "./persistMain/PersistMain";
import Main from "./main";

const NavBar: React.FC = () => {
  return (
    <div className="sticky top-0 w-full z-30">
      <Main />
      <PersistMain />
      <SubMain />
    </div>
  );
};

export default NavBar;
