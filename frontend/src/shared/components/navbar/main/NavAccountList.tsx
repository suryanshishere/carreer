import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "shared/store/auth-slice";
import {
  closeAllDropdowns,
  toggleDropdownState,
} from "shared/store/dropdown-slice";
import { startCase } from "lodash";
import { RootState } from "shared/store";

interface NavAccountListProps {
  data: Record<string, { link: string; role?: string | string[] } | null>;
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

  const navItems = Object.entries(data).map(([header, item], index) => {
    let component = null;

    if (!item) {
      component = (
        <button
          onClick={
            header === "logout"
              ? logoutHandler
              : () => dispatch(toggleDropdownState({ id: header }))
          }
          className={`py-1 px-2 w-full rounded hover:bg-custom-less-white ${
            dropdownStates[header] ? "bg-custom-less-white" : ""
          }`}
        >
          {startCase(header)}
        </button>
      );
    }

    const { role: getRole, link } = item || {};

    if (
      link &&
      (!getRole ||
        role === getRole ||
        (Array.isArray(getRole) && role && getRole.includes(role)))
    ) {
      component = (
        <NavLink
          to={link}
          className={({ isActive }) =>
            `py-1 px-2 block rounded ${
              isActive ? "bg-custom-less-white" : "hover:bg-custom-less-white"
            }`
          }
          onClick={() => dispatch(closeAllDropdowns())}
        >
          {startCase(header)}
        </NavLink>
      );
    }

    return (
      component && (
        <li key={header} className="w-full text-center ">
          {component}
          {index < Object.entries(data).length - 1 && <hr className="my-1" />}
        </li>
      )
    );
  });

  return (
    <ul className="absolute top-full rounded -translate-x-1/2 h-fit w-fit text-sm flex flex-col items-center text-custom-black bg-custom-less-gray p-1">
      {navItems}
    </ul>
  );
};

export default NavAccountList;
