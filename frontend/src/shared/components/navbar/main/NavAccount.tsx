import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { handleAuthClick } from "shared/store/auth-slice";
import { handleShowNavDropdown } from "shared/store/dropdown-slice";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavAccountList from "../subMain/navAccount/NavAccountList";
import Button from "shared/utils/form/Button";

const NavAccount = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isNavAuthClicked = useSelector(
    (state: RootState) => state.auth.isNavAuthClicked
  );
  const showNavDropdown = useSelector(
    (state: RootState) => state.dropdown.showNavDropdown
  );
  const { token } = useSelector(
    (state: RootState) => state.auth.userData
  );

  let LoginSignup = (
    <>
      {!isNavAuthClicked && (
        <Button
        auth
          classProp="px-2 py-1 text-sm"
          onClick={() => dispatch(handleAuthClick(!isNavAuthClicked))}
        >
          {/* <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-custom-black"></span>
          <span className="relative inline-block h-full w-full rounded px-2 py-1 font-bold text-custom-white bg-custom-red hover:bg-custom-less-red"> */}
            Login / Signup
          {/* </span> */}
        </Button>
      )}
    </>
  );

  let onAuthenticated = (
    <>
      <NavLink to="/user/saved-posts" className={({ isActive }) => (isActive ? "text-custom-pale-orange" : "")}> 
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
            onClick={() => dispatch(handleShowNavDropdown(!showNavDropdown))}
            className={`h-6 w-6 flex items-center justify-center rounded-full ${
              showNavDropdown
                ? "text-custom-black bg-custom-pale-orange"
                : "hover:bg-custom-pale-orange hover:text-custom-black"
            }`}
          >
            <ArrowDropDownIcon />
          </button>
          {showNavDropdown && (
            <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
              <NavAccountList />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex gap-3 items-center h-main-nav">
      {!(token) ? LoginSignup : onAuthenticated}
    </div>
  );
};

export default NavAccount;
