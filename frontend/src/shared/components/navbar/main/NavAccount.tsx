import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/auth-slice";
import {
  closeAllDropdowns,
  toggleDropdownState,
} from "shared/store/dropdown-slice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavAccountList from "./NavAccountList";
import Button from "shared/utils/form/Button";
import NAV_ACCOUNT_LIST from "db/shared/nav/navAccountList.json"; 
import useOutsideClick from "shared/hooks/click-outside-hook";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
 
const NavAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isNavAuthClicked = useSelector(
    (state: RootState) => state.auth.isNavAuthClicked
  );
  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );
  const { token, role } = useSelector(
    (state: RootState) => state.auth.userData
  );

  let LoginSignup = (
    <>
      {!isNavAuthClicked && (
        <Button
          loginSignupType
          classProp="px-2 py-1 text-sm"
          onClick={() => dispatch(handleAuthClick(!isNavAuthClicked))}
        >
          Login / Signup
        </Button>
      )}
    </>
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(accountDropdownRef, () => dispatch(closeAllDropdowns()));

  const dropdownHandler = () => {
    if (dropdownStates["main_nav_account"]) {
      dispatch(closeAllDropdowns());
    } else {
      dispatch(toggleDropdownState({ id: "main_nav_account" }));
    }
  };

  const onAuthenticated = (
    <>
      {(role === "admin" || role === "approver") && (
        <NavLink
          to="/approver/contributions-section"
          className="text-custom-pale-orange"
        >
          Contributions
        </NavLink>
      )}
      {role === "admin" && (
        <NavLink to="/admin/access" className="text-custom-pale-orange">
          Access
        </NavLink>
      )}
      <NavLink
        to="/user/account/saved-posts"
        className={({ isActive }) =>
          isActive ? "text-custom-pale-orange" : ""
        }
      >
        Saved  
      </NavLink>
      <div
        onClick={dropdownHandler}
        className={`py-[2px] px-1 rounded-full flex items-center hover:cursor-pointer  ${
          dropdownStates["main_nav_account"]
            ? "bg-custom-less-gray text-custom-gray shadow-md shadow-custom-black"
            : ""
        }`}
      >
        <PermIdentityOutlinedIcon fontSize="small" />
        <ArrowDropDownIcon fontSize="small" />
      </div>
      <div className="absolute right-0 top-full -mt-[4px] flex float-start flex-row-reverse gap-1">
        {dropdownStates["main_nav_account"] && (
          <NavAccountList data={NAV_ACCOUNT_LIST} />
        )}
        {dropdownStates["setting"] && (
          <NavAccountList data={NAV_ACCOUNT_LIST.setting} />
        )}
      </div>
    </>
  );

  return (
    <div
      ref={accountDropdownRef}
      className="relative flex gap-2 items-center h-main-nav z-20"
    >
      {!token ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
