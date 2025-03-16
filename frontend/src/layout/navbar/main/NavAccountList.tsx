import React from "react";
import { startCase } from "lodash";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "shared/store";
import { INavAccountList, useNavAccountList } from "users/db";
import { closeAllDropdowns } from "shared/store/dropdownSlice";

interface NavAccountListProps {
  keyProp?: keyof INavAccountList;
  className?: string;
}

const NavAccountList: React.FC<NavAccountListProps> = ({
  keyProp,
  className = "",
}) => {
  const dispatch = useDispatch();
  const navList = useNavAccountList(keyProp);
  const { role: userRole } = useSelector(
    (state: RootState) => state.user.userData
  );
  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );

  const renderItem = (key: string, item: any, index: number, total: number) => {
    // If the item has a role field, only render it if the user's role is included.
    if (item?.role) {
      const allowed = Array.isArray(item.role)
        ? item.role.includes(userRole)
        : item.role === userRole;
      if (!allowed) return null;
    }

    let component = null;
    const label = startCase(key);

    // Render a button if a function exists; otherwise, render a NavLink if a link is provided.
    if (item?.link) {
      component = (
        <NavLink
          to={item.link}
          className={({ isActive }) =>
            `py-1 px-2 block rounded ${
              isActive ? "bg-custom_white" : "hover:bg-custom_white"
            }`
          }
          onClick={() => dispatch(closeAllDropdowns())}
        >
          {label}
        </NavLink>
      );
    } else if (item?.func) {
      component = (
        <button
          onClick={item.func}
          className={`py-1 px-2 w-full rounded hover:bg-custom_white ${
            dropdownStates[key] ? "bg-custom_white" : ""
          }`}
        >
          {label}
        </button>
      );
    }

    return (
      component && (
        <li key={key} className="w-full text-center">
          {component}
          {index < total - 1 && <hr className="my-1" />}
        </li>
      )
    );
  };

  const keys = Object.keys(navList);
  const total = keys.length;

  return (
    <ul
      className={`h-fit w-[7rem] rounded shadow-md shadow-custom_black text-sm flex flex-col items-center text-custom_black bg-custom_less_gray p-1 ${className}`}
    >
      {keys.map((key, index) =>
        renderItem(key, (navList as any)[key], index, total)
      )}
    </ul>
  );
};

export default NavAccountList;
