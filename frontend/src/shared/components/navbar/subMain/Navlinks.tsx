import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import NAVLINKS from "db/shared/nav/navlinks.json";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/click-outside-hook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";


const Navlinks: React.FC = () => {
  const navEntries = Object.entries(NAVLINKS);
  const displayedLinks = navEntries.slice(0, 4); // First 4 items
  const dropdownLinks = navEntries.slice(4); // Remaining items

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  return (
    <div className="flex-1 flex items-center gap-2">
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
        <div ref={dropdownRef} className="relative flex-1">
          <button
            className="p-1 w-full bg-custom-less-gray"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            More Section <ArrowDropDownIcon />
          </button>
          {showDropdown && (
            <ul className="absolute top-full mt-1 w-full bg-custom-less-gray p-1">
              {dropdownLinks.map(([key, link], index) => (
                <>
                  <li key={link} className="text-center">
                    <NavLink
                      to={link}
                      className={({ isActive }) =>
                        `py-1 px-2 block ${
                          isActive
                            ? "bg-custom-less-white"
                            : "hover:bg-custom-less-white"
                        }`
                      }
                      onClick={() => setShowDropdown(false)}
                    >
                      {startCase(key)}
                    </NavLink>
                  </li>
                  {index < Object.entries(dropdownLinks).length - 1 && (
                    <hr className="my-1" />
                  )}
                </>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Navlinks;
