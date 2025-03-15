import React, { useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/outside-click-hook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useResponsiveView, { IView } from "shared/hooks/useResponsiveView";
import POST_DB, { ISectionKey } from "posts/db";
import NavDropdownUI from "shared/ui/NavDropdownUI";

const visibleLinksMap = {
  mobile: 1,
  medium_mobile: 4,
  large_mobile: 5,
  tablet: 4,
  desktop: 4,
  desktop_hd: 6,
} as const;

type VisibleLinksKeys = keyof typeof visibleLinksMap;

const NAVLINKS = {
  home: { link: "/" },
  ...Object.fromEntries(
    POST_DB.sections.map((section) => [
      section,
      { link: `/sections/${section}` },
    ])
  ),
};

const Navlinks: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();
  const navEntries = Object.entries(NAVLINKS);

  const viewType: IView = useResponsiveView();
  const visibleLinksCount = visibleLinksMap[viewType as VisibleLinksKeys] ?? 0;

  const displayedLinks = navEntries.slice(0, visibleLinksCount);
  const dropdownLinks = navEntries.slice(visibleLinksCount);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Determine the selected section for the dropdown button label
  const selectedSection =
    dropdownLinks.find(([key]) => key === section)?.[0] || null;

  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  return (
    <div className="flex-1 h-full flex items-center gap-3 min-w-30">
      {displayedLinks.length > 0 && (
        <ul className="m-0 py-1 h-full flex gap-3 items-center overflow-x-auto scrollbar-hide">
          {displayedLinks.map(([key, item]) => (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                `no-underline min-w-fit whitespace-nowrap ${
                  isActive ? "text-custom_red" : "hover:text-custom_red"
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
            className={`rounded-full outline outline-custom_gray w-full bg-custom_less_gray px-1 flex items-center justify-center gap-2 ${
              viewType === "mobile" ? "py-1" : "py-[1px]"
            } ${showDropdown && "shadow-md shadow-custom_black"}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedSection ? startCase(selectedSection) : "More Section"}
            <ArrowDropDownIcon fontSize="small" />
          </button>
          <NavDropdownUI isVisible={showDropdown}>
            {dropdownLinks.map(([key, item]) => (
              <NavLink
                key={key}
                to={item.link}
                onClick={() => setShowDropdown(false)}
              >
                {startCase(key)}
              </NavLink>
            ))}
          </NavDropdownUI>
        </div>
      )}
    </div>
  );
};

export default Navlinks;
