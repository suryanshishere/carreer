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
  data: Record<string, { link: string; role?: string } | null>;
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
    let component;

    if (!item) {
      component = (
        <button
          onClick={
            header === "logout"
              ? logoutHandler
              : () => dispatch(toggleDropdownState(header))
          }
          className={`py-1 px-2 rounded w-full hover:bg-custom-less-white ${
            dropdownStates[header] ? "bg-custom-less-white" : ""
          }`}
        >
          {startCase(header)}
        </button>
      );
    } else {
      const { role: getRole, link } = item;
      if (link) {
        component = (
          <>
            {(!getRole || role === getRole) && (
              <NavLink
                to={link}
                className={({ isActive }) =>
                  `py-1 px-2 rounded block ${
                    isActive
                      ? "bg-custom-less-white"
                      : "hover:bg-custom-less-white"
                  }`
                }
                onClick={() => dispatch(closeAllDropdowns())}
              >
                {startCase(header)}
              </NavLink>
            )}
          </>
        );
      }
    }

    return (
      <div key={header} className="w-full text-center">
        {component}
        {index < Object.entries(data).length - 1 && (
          <hr className="my-1 mx-[2px] border-custom-gray" />
        )}
      </div>
    );
  });

  return (
    <ul className="h-fit w-fit rounded text-sm flex flex-col items-center text-custom-black bg-custom-pale-orange p-1">
      {navItems}
    </ul>
  );
};

export default NavAccountList;
