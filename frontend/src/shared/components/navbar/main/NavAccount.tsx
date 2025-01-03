import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/auth-slice";
import {
  toggleDropdownState,
  closeAllDropdowns,
} from "shared/store/dropdown-slice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavAccountList from "./NavAccountList";
import Button from "shared/utils/form/Button";
import NAV_ACCOUNT_LIST from "db/shared/nav/navAccountList.json";
import SETTING_LIST from "db/shared/nav/setting.json";
import useOutsideClick from "shared/hooks/click-outside-hook";

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

  const showNavDropdown = dropdownStates["main_nav_account"] || false;
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () =>
    dispatch(toggleDropdownState({ id: "main_nav_account", state: false }))
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

  let onAuthenticated = (
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
        Saved Posts
      </NavLink>
      <div className="flex justify-center items-center gap-2">
        <div>Cool</div>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => {
              dispatch(toggleDropdownState({ id: "main_nav_account" }));
              if (dropdownStates["setting"])
                dispatch(toggleDropdownState({ id: "setting" }));
            }}
            className={`h-6 w-6 flex items-center justify-center rounded-full ${
              showNavDropdown
                ? "text-custom-black bg-custom-less-gray"
                : "hover:bg-custom-less-gray hover:text-custom-black"
            }`}
          >
            <ArrowDropDownIcon />
          </button>
          <div className="absolute top-full left-1/2 mt-1 shadow rounded shadow-custom-black -translate-x-1/2">
            {showNavDropdown && <NavAccountList data={NAV_ACCOUNT_LIST} />}
          </div>
          <div className="absolute top-full shadow round shadow-custom-black">
            {dropdownStates["setting"] && (
              <NavAccountList data={SETTING_LIST} />
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex gap-3 items-center h-main-nav">
      {!token ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
