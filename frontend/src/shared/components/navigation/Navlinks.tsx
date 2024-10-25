import React from "react";
import { NavLink } from "react-router-dom";
import NAV from "db/nav/Nav.json";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";

const Navlinks: React.FC = () => {
  return (
    <ul className="m-0 p-0 flex gap-2 items-center">
      {NAV.map((item) =>
        item ? (
          <NavLink
            key={item}
            to={item === "home" ? `/`: `/category/${item}`}
            className={({ isActive }) =>
            `no-underline p-1  ${
              isActive ? "font-bold text-custom-red" : "hover:text-custom-red font-medium"
            }`
          }
          >
            {formatWord(item)}
          </NavLink>
        ) : (
          <React.Fragment key={item}></React.Fragment>
        )
      )}
    </ul>
  );
};

export default React.memo(Navlinks);
