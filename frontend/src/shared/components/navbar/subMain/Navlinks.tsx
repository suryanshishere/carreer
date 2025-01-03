import React from "react";
import { NavLink } from "react-router-dom";
import NAVLINKS from "db/shared/nav/navlinks.json";
import { startCase } from "lodash";

const Navlinks: React.FC = () => {
  return (
    <ul className="m-0 p-0 h-full flex gap-2 items-center overflow-x-auto scrollbar-hide">
      {Object.entries(NAVLINKS).map(([key, link]) => (
        <NavLink
          key={link}
          to={link}
          className={({ isActive }) =>
            `no-underline p-1 min-w-fit whitespace-nowrap ${
              isActive ? "text-custom-red" : "hover:text-custom-red"
            }`
          }
        >
          {startCase(key)}
        </NavLink>
      ))}
    </ul>
  );
};

export default Navlinks;
