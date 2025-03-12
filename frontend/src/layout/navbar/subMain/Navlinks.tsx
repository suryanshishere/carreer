import React, { useRef } from "react";
import { NavLink, useParams } from "react-router-dom";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/outside-click-hook";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useResponsiveView, {
  viewObject,
  ViewType,
} from "shared/hooks/useResponsiveView";
import POST_DB from "posts/db";

const visibleLinksMap = {
  mobile: 1,
  medium_mobile: 3 ,
  large_mobile: 5,
  tablet: 6,
  desktop: 4,
  extra_large: 6
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

  const viewType: ViewType = useResponsiveView(viewObject);
  const visibleLinksCount = visibleLinksMap[viewType as VisibleLinksKeys] ?? 0;

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
            className={`rounded-full outline outline-custom_gray w-full bg-custom_less_gray px-2 flex items-center justify-center gap-2 ${
                viewType === "mobile"? "py-1" : "py-[1px]"
            } ${showDropdown && "shadow-md shadow-custom_black"}`}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedSection ? startCase(selectedSection) : "More Section"}
            <ArrowDropDownIcon
              fontSize="small"
              className="rounded-full bg-custom_gray text-custom_less_gray"
            />
          </button>
          {showDropdown && (
            <ul className="rounded absolute top-full mt-1 w-full bg-custom_less_gray shadow-md shadow-custom_black">
              {dropdownLinks.map(([key, item], index) => (
                <React.Fragment key={key}>
                  <li className="text-center">
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        `m-1 py-1 block rounded ${
                          isActive
                            ? "bg-custom_white"
                            : "hover:bg-custom_white"
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
