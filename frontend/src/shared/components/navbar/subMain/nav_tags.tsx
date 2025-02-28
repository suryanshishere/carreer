import React, { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useOutsideClick from "shared/hooks/outside-click-hook";
import useResponsiveView, {
  viewObject,
  ViewType,
} from "shared/hooks/responsive-view-hook";
import POST_DB from "post/post_db";

const TAGS = POST_DB.tags;

const NavTags: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  useOutsideClick(dropdownRef, () => setShowTagsDropdown(false));

  const viewType: ViewType = useResponsiveView(viewObject);

  return (
    <div ref={dropdownRef} className="relative min-w-28 flex items-center">
      <button
        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
        className={`rounded-full outline outline-custom_gray w-full h-full bg-custom_less_gray flex items-center justify-center gap-2 lg:hidden ${
          viewType === "tablet" || viewType === "mobile" ? "py-1 " : "py-[1px]"
        }  ${showTagsDropdown && "shadow-md shadow-custom_black"}`}
      >
        Tags
        <ArrowDropDownIcon
          fontSize="small"
          className="rounded-full bg-custom_gray text-custom_less_gray"
        />
      </button>

      {showTagsDropdown && (
        <div className="absolute rounded top-full mt-1 w-full bg-custom_less_gray z-10 shadow-md shadow-custom_black">
          {TAGS.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center gap-2 py-1 px-2 text-xs font-medium hover:bg-custom_less_gray">
                <span className={`h-3 w-3 bg-${item.color}`}></span>
                <h6>{item.label}</h6>
              </div>
              {index < TAGS.length - 1 && <hr className="my-1" />}
            </div>
          ))}
        </div>
      )}

      <div className="hidden lg:flex gap-2">
        {TAGS.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1 text-xs font-medium"
          >
            <span className={`h-3 w-3 bg-${item.color}`}></span>
            <h6>{item.label}</h6>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavTags;
