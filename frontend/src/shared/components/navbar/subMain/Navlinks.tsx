import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import NAVLINKS from "db/shared/nav/navlinks.json";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/click-outside-hook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navlinks: React.FC = () => {
  const navEntries = Object.entries(NAVLINKS);

  // Dynamic breakpoints: adjust visible links based on screen size
  const breakpoints = {
    default: 0,
    md: 3,
    lg: 4,
  };

  // Determine the number of displayed links based on screen width
  const [visibleLinksCount, setVisibleLinksCount] = React.useState(
    breakpoints.default
  );

  React.useEffect(() => {
    const updateVisibleLinks = () => {
      if (window.innerWidth >= 1024) {
        setVisibleLinksCount(breakpoints.lg);
      } else if (window.innerWidth >= 768) {
        setVisibleLinksCount(breakpoints.md);
      } else {
        setVisibleLinksCount(breakpoints.default);
      }
    };

    updateVisibleLinks(); // Initial calculation
    window.addEventListener("resize", updateVisibleLinks); // Listen for screen size changes
    return () => window.removeEventListener("resize", updateVisibleLinks);
  }, []);

  const displayedLinks = navEntries.slice(0, visibleLinksCount);
  const dropdownLinks = navEntries.slice(visibleLinksCount);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  return (
    <div className="flex-1 h-full flex items-center gap-2 min-w-30">
      {displayedLinks.length > 0 && (
        <ul className="m-0 py-1 h-full flex gap-3 items-center overflow-x-auto scrollbar-hide">
          {displayedLinks.map(([key, link]) => (
            <NavLink
              key={link}
              to={link}
              className={({ isActive }) =>
                `no-underline min-w-fit whitespace-nowrap ${
                  isActive ? "text-custom-red" : "hover:text-custom-red"
                }`
              }
            >
              {startCase(key)}
            </NavLink>
          ))}
        </ul>
      )}

      {dropdownLinks.length > 0 && (
        <div ref={dropdownRef} className="relative h-full flex-1 w-full">
          <button
            className="w-full h-full bg-custom-less-gray px-2 flex items-center justify-center gap-2"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            More Section
            <ArrowDropDownIcon
              fontSize="small"
              className="rounded-full bg-custom-gray text-custom-less-gray"
            />
          </button>
          {showDropdown && (
            <ul className="absolute top-full mt-[2px] w-full bg-custom-less-gray">
              {dropdownLinks.map(([key, link], index) => (
                <>
                  <li key={link} className="text-center">
                    <NavLink
                      to={link}
                      className={({ isActive }) =>
                        `m-1 py-1 block ${
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
