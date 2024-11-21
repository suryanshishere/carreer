import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const NavAccountImg = () => {
  // const {navAccountDp} = useSelector((state:RootState)=>state.auth.userData);
  return (
    <>
      {/* <img
        src={`${navAccountDp}`}
        alt="account"
        className="h-full w-full rounded-full object-cover"
      /> */}
    </>
  );
};

export default NavAccountImg;
