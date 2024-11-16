import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "shared/context/auth-context";
import { NavLink } from "react-router-dom";
import Button from "shared/utils/form/Button";
import NavAccountImg from "shared/ui/NavAccountImg";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GradeIcon from "@mui/icons-material/Grade";

const NavAccount = () => {
  const auth = useContext(AuthContext);

  let LoginSignup = (
    <>
      {!auth.clickedAuth && (
        <Button
          classProp="z-50 bg-custom-red hover:bg-custom-less-red px-2 py-1 rounded-full"
          onClick={() => auth.authClickedHandler(true)}
        >
          Login / Signup
        </Button>
      )}
    </>
  );

  let onAuthenticated = (
    <>
      <NavLink to="/user/saved_exam">
        {({ isActive }) => (isActive ? <GradeIcon /> : <GradeOutlinedIcon />)}
      </NavLink>
      <div className="w-8 h-8 overflow-hidden flex justify-center items-center ">
        <NavAccountImg />
        {/* //todo add a certain word limit, random different color bg  */}
        {/* <span className="text-custom-black p-0 m-0 text-justify w-full h-full bg-white">Namesssss</span>  */}
      </div>
    </>
  );

  return (
    <div className="flex gap-3 items-center h-main-nav">
      {!auth.isLoggedIn ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
