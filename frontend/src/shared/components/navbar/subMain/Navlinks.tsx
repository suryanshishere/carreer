import React from "react";
import { NavLink } from "react-router-dom";
import NAVLINKS from "db/shared/nav/NavLinks.json";
import { startCase } from "lodash";
import { ICommonMap } from "models/quick/ICommonMap";

const Navlinks: React.FC = () => {
  return (
    <ul className="m-0 p-0 h-full flex-1 flex gap-2 items-center overflow-x-auto scrollbar-hide">
      {NAVLINKS.map(
        (item: ICommonMap) =>
          item.link && (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                `no-underline p-1 min-w-fit whitespace-nowrap  ${
                  isActive ? "text-custom-red" : "hover:text-custom-red"
                }`
              }
            >
              {startCase(item.header)}
            </NavLink>
          )
      )}
    </ul>
  );
};

export default Navlinks;
