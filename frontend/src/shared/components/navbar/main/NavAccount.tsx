import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Button from "shared/utils/form/Button";
import NavAccountImg from "shared/ui/NavAccountImg";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import GradeIcon from "@mui/icons-material/Grade";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/auth-slice";

const NavAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isNavAuthClicked = useSelector((state: RootState) => state.auth.isNavAuthClicked);
  const { userId, email, token } = useSelector(
    (state: RootState) => state.auth.userData
  );

  let LoginSignup = (
    <>
      {!isNavAuthClicked && (
        <Button
          classProp="z-50 bg-custom-red hover:bg-custom-less-red px-2 py-1 rounded-full"
          onClick={() => dispatch(handleAuthClick(true))}
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
      </div>
    </>
  );

  return (
    <div className="flex gap-3 items-center h-main-nav">
      {!(token && email && userId) ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
