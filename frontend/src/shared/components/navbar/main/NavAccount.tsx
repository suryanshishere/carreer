import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/auth-slice";
import { toggleDropdownState } from "shared/store/dropdown-slice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavAccountList from "./NavAccountList";
import Button from "shared/utils/form/Button";
import NAV_ACCOUNT_LIST from "db/shared/nav/navAccountList.json";
import SETTING_LIST from "db/shared/nav/setting.json";

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
      {role === "admin" && (
        <NavLink to="/admin/publisher-access" className="text-custom-pale-orange">
          Publisher Access
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
        <div>
          {/* {email &&
            `${email.slice(0, 3)}***${email.slice(email.indexOf("@") - 2)}`}  */}
          Cool 
        </div>
        <div className="relative">
          <button
            onClick={() => {
              dispatch(toggleDropdownState("main_nav_account"));
              if (dropdownStates["setting"])
                dispatch(toggleDropdownState("setting"));
            }}
            className={`h-6 w-6 flex items-center justify-center rounded-full ${
              showNavDropdown
                ? "text-custom-black bg-custom-pale-orange"
                : "hover:bg-custom-pale-orange hover:text-custom-black"
            }`}
          >
            <ArrowDropDownIcon />
          </button>
          <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
            {showNavDropdown && <NavAccountList data={NAV_ACCOUNT_LIST} />}
          </div>
          <div className="absolute top-full right-4 mt-2 -translate-x-1/2">
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
