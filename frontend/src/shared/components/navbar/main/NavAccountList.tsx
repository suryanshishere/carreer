import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "shared/store/auth-slice";
import {
  closeAllDropdowns,
  toggleDropdownState,
} from "shared/store/dropdown-slice";
import { startCase } from "lodash";
import { RootState } from "shared/store";
import { INavAccData, NavItem } from "models/shared/INavAccList";

interface NavAccountListProps {
  data: INavAccData;
}

const NavAccountList: React.FC<NavAccountListProps> = ({ data }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role } = useSelector((state: RootState) => state.auth.userData);

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
          className={`py-1 px-2 w-full rounded hover:bg-custom-white ${
            dropdownStates[key] ? "bg-custom-white" : ""
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
            className={`py-1 px-2 w-full rounded hover:bg-custom-white ${
              dropdownStates[key] ? "bg-custom-white" : ""
            }`}
          >
            {startCase(key)}
          </button>
        );
      } else if ("link" in value) {
        const { role: getRole, link } = value as NavItem;

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
                  isActive
                    ? "bg-custom-white"
                    : "hover:bg-custom-white"
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
    <ul className="h-fit w-[5.95rem] rounded shadow-md shadow-custom-black text-sm flex flex-col items-center text-custom-black bg-custom-less-gray p-1">
      {navItems}
    </ul>
  );
};

export default NavAccountList;
