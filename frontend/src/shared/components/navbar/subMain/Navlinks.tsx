import React from "react";
import { NavLink } from "react-router-dom";
import NAV from "db/shared/nav/Nav.json";
import { formatWord } from "shared/quick/format-word";

const Navlinks: React.FC = () => {
  return (
    <ul className="m-0 p-0 h-full flex-1 flex gap-2 items-center overflow-x-auto scrollbar-hide">
      {NAV.map((item) =>
        item ? (
          <NavLink
            key={item}
            to={item === "home" ? `/` : `/category/${item}`}
            className={({ isActive }) =>
              `no-underline p-1 min-w-fit whitespace-nowrap  ${
                isActive ? "text-custom-red" : "hover:text-custom-red"
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

export default Navlinks;
