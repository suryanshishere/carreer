import React from "react";
import NAV_ACCOUNT_LIST from "db/shared/nav/NavAccountList.json";
import { NavLink } from "react-router-dom";

const NavAccountList = () => {
  return (
    <ul className="h-full flex gap-2 items-center bg-custom-less-white px-[2px] scrollbar-hide">
      {NAV_ACCOUNT_LIST.map((item) => (
        item.link ? (
          <li key={item.link}>
            <NavLink to={item.link} className="px-2 py-1 hover:bg-custom-super-less-grey">
              {item.header}
            </NavLink>
          </li>
        ) : null
      ))}
      <button className="px-2 py-1 mt-[2px] hover:bg-custom-super-less-grey">Logout</button>
    </ul>
  );
};

export default NavAccountList;
