import React from "react";
import { NavLink } from "react-router-dom";
import NAVLINKS from "db/shared/nav/navlinks.json";
import { startCase } from "lodash";

const Navlinks: React.FC = () => {
  const navEntries = Object.entries(NAVLINKS);
  const displayedLinks = navEntries.slice(0, 4); // First 4 items
  const dropdownLinks = navEntries.slice(4); // Remaining items

  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="w-full flex-1 flex items-center gap-2">
      <ul className="m-0 p-0 h-full flex gap-2 items-center overflow-x-auto scrollbar-hide">
        {displayedLinks.map(([key, link]) => (
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

      {dropdownLinks.length > 0 && (
        <div className="relative  flex-1">
          <button className="p-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setShowDropdown(!showDropdown)}>
            More ▼
          </button>
          {showDropdown && (
            <ul className="absolute top-full right-0 bg-gray-200 rounded p-2 z-50">
              {dropdownLinks.map(([key, link]) => (
                <li key={link} className="py-1">
                  <NavLink
                    to={link}
                    className={({ isActive }) =>
                      `no-underline block px-3 py-1 whitespace-nowrap ${
                        isActive ? "text-custom-red" : "hover:text-custom-red"
                      }`
                    }
                  >
                    {startCase(key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Navlinks;
