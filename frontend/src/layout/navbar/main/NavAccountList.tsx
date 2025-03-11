import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "shared/store/userSlice";
import {
  closeAllDropdowns,
  toggleDropdownState,
} from "shared/store/dropdownSlice";
import { startCase } from "lodash";
import { RootState } from "shared/store";
import { INavAccountData } from "user/user-db";

const NavAccountList: React.FC<{ data: INavAccountData }> = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role } = useSelector((state: RootState) => state.user.userData);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(closeAllDropdowns());
    navigate("/");
  };

  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );

  const navItems = Object.entries(data).map(([key, value], index) => {
    let component = null;

    if (!value) {
      component = (
        <button
          onClick={
            key === "logout"
              ? logoutHandler
              : () => dispatch(toggleDropdownState({ id: key }))
          }
          className={`py-1 px-2 w-full rounded hover:bg-custom_white ${
            dropdownStates[key] ? "bg-custom_white" : ""
          }`}
        >
          {startCase(key)}
        </button>
      );
    } else {
      if (typeof value === "object" && !("role" in value || "link" in value)) {
        component = (
          <button
            onClick={() => dispatch(toggleDropdownState({ id: key }))}
            className={`py-1 px-2 w-full rounded hover:bg-custom_white ${
              dropdownStates[key] ? "bg-custom_white" : ""
            }`}
          >
            {startCase(key)}
          </button>
        );
      } else if ("link" in value) {
        const { role: getRole, link } = value;

        if (
          link &&
          (!getRole ||
            (typeof getRole === "string" && role === getRole) ||
            (Array.isArray(getRole) && role && getRole.includes(role)))
        ) {
          component = (
            <NavLink
              to={link}
              className={({ isActive }) =>
                `py-1 px-2 block rounded ${
                  isActive ? "bg-custom_white" : "hover:bg-custom_white"
                }`
              }
              onClick={() => dispatch(closeAllDropdowns())}
            >
              {startCase(key)}
            </NavLink>
          );
        }
      }
    }

    return (
      component && (
        <li key={key} className="w-full text-center">
          {component}
          {index < Object.entries(data).length - 1 && <hr className="my-1" />}
        </li>
      )
    );
  });

  return (
    <ul className="h-fit w-[7rem] rounded shadow-md shadow-custom_black text-sm flex flex-col items-center text-custom_black bg-custom_less_gray p-1">
      {navItems}
    </ul>
  );
};

export default NavAccountList;
