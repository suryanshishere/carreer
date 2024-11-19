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
  const isNavAuthClicked = useSelector(
    (state: RootState) => state.auth.isNavAuthClicked
  );
  const { userId, email, token } = useSelector(
    (state: RootState) => state.auth.userData
  );

  let LoginSignup = (
    <>
      {!isNavAuthClicked && (
        <button
          className="relative text-sm"
          onClick={() => dispatch(handleAuthClick(true))}
        >
          <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-custom-black"></span>
          <span className="relative inline-block h-full w-full rounded px-2 py-1 font-bold text-custom-white bg-custom-red hover:bg-custom-less-red">
            Login / Signup
          </span>
        </button>
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
