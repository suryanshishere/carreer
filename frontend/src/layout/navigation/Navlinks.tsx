import React from "react";
import { NavLink} from "react-router-dom";
import NAV from "db/nav/Nav.json";
import "./Navlinks.css";

const Navlinks: React.FC = () => {
  return (
    <ul className="nav_links m-0 p-0 flex gap-2">
      {NAV.map((item) =>
        item.link ? (
          <NavLink
            key={item.header}
            to={item.link}
            className={({ isActive }) =>
              isActive ? "nav_link_active nav_link" : "nav_link"
            }
          >
            {item.header}
          </NavLink>
        ) : (
          <React.Fragment key={item.header}></React.Fragment>
        )
      )}
    </ul>
  );
};

export default React.memo(Navlinks);
