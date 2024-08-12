import React from "react";
import { NavLink } from "react-router-dom";
import NAV from "db/nav/Nav.json";
import "./Navlinks.css";
import { formatWord } from "shared/uiComponents/uiUtilComponents/format-word";

const Navlinks: React.FC = () => {
  return (
    <ul className="nav_links m-0 p-0 flex gap-2">
      {NAV.map((item) =>
        item ? (
          <NavLink
            key={item}
            to={item === "home" ? `/`: `/category/${item}`}
            className={({ isActive }) =>
              isActive ? "nav_link_active nav_link" : "nav_link"
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
