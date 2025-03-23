import React, { useRef } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { startCase } from "lodash";
import useOutsideClick from "shared/hooks/outside-click-hook";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import useResponsiveView, { IView } from "shared/hooks/useResponsiveView";
import POST_DB from "posts/db";
import NavDropdownUI from "shared/ui/NavDropdownUI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { toggleDropdownState } from "shared/store/dropdownSlice";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Button from "shared/utils/form/Button";

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
  const dropdownKey = "navlinks";
  const showDropdown = useSelector(
    (state: RootState) => state.dropdown.dropdownStates[dropdownKey]
  );
  const dispatch = useDispatch<AppDispatch>();

  // Determine the selected section for the dropdown button label
  const location = useLocation();
  const isValidUrl = /^\/sections\/[^/]+$/.test(location.pathname);
  const selectedSection =
    (isValidUrl && dropdownLinks.find(([key]) => key === section)?.[0]) || null;

  useOutsideClick(dropdownRef, () =>
    dispatch(toggleDropdownState({ id: dropdownKey, bool: false }))
  );

  return (
    <div className="flex-1 h-full flex items-center gap-[.75rem] mobile:gap-3 min-w-30">
      {displayedLinks.length > 0 && (
        <ul className="m-0 py-1 h-full flex gap-3 items-center overflow-x-auto scrollbar-hide">
          {displayedLinks.map(([key, item]) => (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                `no-underline min-w-fit whitespace-nowrap ${
                  isActive
                    ? "text-custom_red"
                    : key === "home" && viewType === "mobile"
                    ? "text-custom_gray"
                    : "hover:text-custom_re"
                }`
              }
            >
              {key === "home" && viewType === "mobile" ? (
                <HomeOutlinedIcon />
              ) : (
                startCase(key)
              )}
            </NavLink>
          ))}
        </ul>
      )}

      {dropdownLinks.length > 0 && (
        <div ref={dropdownRef} className="relative flex-1 w-full">
          <Button
            navButton
            className={`${
              showDropdown ? "bg-custom_less_gray" : "hover:bg-custom_less_gray"
            } ${viewType === "mobile" ? "py-[2px]" : ""}`}
            onClick={() => dispatch(toggleDropdownState({ id: dropdownKey }))}
          >
            {selectedSection ? startCase(selectedSection) : "More Section"}
            {showDropdown ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            )}
          </Button>
          <NavDropdownUI isVisible={showDropdown}>
            {dropdownLinks.map(([key, item]) => (
              <React.Fragment key={key}>
                <NavLink
                  key={key}
                  to={item.link}
                  onClick={() =>
                    dispatch(toggleDropdownState({ id: dropdownKey }))
                  }
                  className={({ isActive }) =>
                    `p-1 ${
                      isActive ? "bg-custom_white" : "hover:bg-custom_white"
                    }`
                  }
                >
                  {startCase(key)}
                </NavLink>
              </React.Fragment>
            ))}
          </NavDropdownUI>
        </div>
      )}
    </div>
  );
};

export default Navlinks;
