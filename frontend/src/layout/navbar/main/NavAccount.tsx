import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/userSlice";
import {
  closeAllDropdowns,
  closeSpecificDropdowns,
  toggleDropdownState,
} from "shared/store/dropdownSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavAccountList from "./NavAccountList";
import Button from "shared/utils/form/Button";
import useOutsideClick from "shared/hooks/outside-click-hook";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const NavAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isNavAuthClicked = useSelector(
    (state: RootState) => state.user.isNavAuthClicked
  );
  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );
  const token = useSelector((state: RootState) => state.user.token);

  let LoginSignup = (
    <>
      {!isNavAuthClicked && (
        <Button
          loginSignupType
          className="px-2 py-1 text-sm"
          onClick={() => dispatch(handleAuthClick(!isNavAuthClicked))}
        >
          Login / Signup
        </Button>
      )}
    </>
  );

  const accountDropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(accountDropdownRef, () =>
    dispatch(closeSpecificDropdowns(["main_nav_account", "setting"]))
  );

  const dropdownHandler = () => {
    if (dropdownStates["main_nav_account"]) {
      dispatch(closeAllDropdowns());
    } else {
      dispatch(toggleDropdownState({ id: "main_nav_account" }));
    }
  };

  const onAuthenticated = (
    <>
      <NavLink
        to="/user/account/saved-posts"
        className={({ isActive }) =>
          isActive ? "text-custom_pale_orange" : ""
        }
      >
        Saved
      </NavLink>
      <button
        onClick={dropdownHandler}
        className={`py-[2px] px-1 rounded-full flex items-center hover:cursor-pointer  ${
          dropdownStates["main_nav_account"]
            ? "bg-custom_less_gray text-custom_gray shadow-md shadow-custom_black"
            : ""
        }`}
      >
        <PermIdentityOutlinedIcon fontSize="small" />
        {dropdownStates["main_nav_account"] ? (
          <ExpandLessIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
      </button>
      <div className="absolute right-0 top-full -mt-[4px] flex float-start flex-row-reverse gap-1">
        {dropdownStates["main_nav_account"] && <NavAccountList />}
        {dropdownStates["setting"] && <NavAccountList keyProp="setting" />}
      </div>
    </>
  );

  return (
    <div
      ref={accountDropdownRef}
      className="relative flex gap-3 items-center h-main-nav z-50"
    >
      {!token ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
