import React, { useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import NAVLINKS from "db/shared/nav/navlinks.json";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/click-outside-hook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navlinks: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();
  const navEntries = Object.entries(NAVLINKS);

  const breakpoints = {
    default: 0,
    md: 3,
    lg: 4,
  };

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

    updateVisibleLinks();
    window.addEventListener("resize", updateVisibleLinks);
    return () => window.removeEventListener("resize", updateVisibleLinks);
  }, []);

  const displayedLinks = navEntries.slice(0, visibleLinksCount);
  const dropdownLinks = navEntries.slice(visibleLinksCount);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Determine the selected section for the dropdown button label
  const selectedSection =
    dropdownLinks.find(([key]) => key === section)?.[0] || null;

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  const handleSelectLink = (sectionName: string) => {
    setShowDropdown(false);
  };

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
        <div ref={dropdownRef} className="relative flex-1 w-full">
          <button
            className={`rounded-full outline outline-custom-gray w-full bg-custom-less-gray px-2 sm:py-[1px] flex items-center justify-center gap-2 ${
              visibleLinksCount === 0 && "py-1"
            } ${showDropdown && "shadow-md shadow-custom-black"}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedSection ? startCase(selectedSection) : "More Section"}
            <ArrowDropDownIcon
              fontSize="small"
              className="rounded-full bg-custom-gray text-custom-less-gray"
            />
          </button>
          {showDropdown && (
            <ul className="rounded absolute top-full mt-1 w-full bg-custom-less-gray shadow-md shadow-custom-black">
              {dropdownLinks.map(([key, link], index) => (
                <React.Fragment key={key}>
                  <li className="text-center">
                    <NavLink
                      to={link}
                      className={({ isActive }) =>
                        `m-1 py-1 block rounded ${
                          isActive
                            ? "bg-custom-less-white"
                            : "hover:bg-custom-less-white"
                        }`
                      }
                      onClick={() => handleSelectLink(key)}
                    >
                      {startCase(key)}
                    </NavLink>
                  </li>
                  {index < dropdownLinks.length - 1 && <hr className="my-1" />}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Navlinks;
