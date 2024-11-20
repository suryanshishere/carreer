import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "shared/store/auth-slice";
import { handleShowNavDropdown } from "shared/store/dropdown-slice";
import { RootState } from "shared/store";
import NAV_ACCOUNT_LIST from "db/shared/nav/NavAccountList.json";

const NavAccountList = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(handleShowNavDropdown(false));
    dispatch(logout());
  };

  const navItems = NAV_ACCOUNT_LIST.map(({ link, header }, index) => (
    <div key={header} className="w-full">
      {link ? (
        <NavLink
          to={link}
          className={({ isActive }) =>
            `py-1 px-2 rounded block ${
              isActive ? "bg-custom-less-white" : "hover:bg-custom-less-white"
            }`
          }
          onClick={() => dispatch(handleShowNavDropdown(false))}
        >
          {header}
        </NavLink>
      ) : (
        <button
          onClick={logoutHandler}
          className="py-1 px-2 rounded w-full text-left hover:bg-custom-less-white"
        >
          {header}
        </button>
      )}
      {index < NAV_ACCOUNT_LIST.length - 1 && (
        <hr className="my-1 mx-[2px] border-custom-grey" />
      )}
    </div>
  ));

  return (
    <ul className="h-fit w-fit rounded text-sm flex flex-col items-center text-custom-black bg-custom-pale-orange p-1">
      {navItems}
    </ul>
  );
};

export default NavAccountList;
