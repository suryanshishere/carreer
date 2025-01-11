import React, { useRef, useState } from "react";
import TAGS from "db/postDb/tags.json";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useOutsideClick from "shared/hooks/click-outside-hook";

const Tags: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  useOutsideClick(dropdownRef, () => setShowTagsDropdown(false));

  return (
    <div ref={dropdownRef} className="relative h-full min-w-28 flex items-center">
      {/* Button for Tags Dropdown on Mobile */}
      <button
        onClick={() => setShowTagsDropdown(!showTagsDropdown)}
        className={`rounded-full w-full h-full bg-custom-less-gray px-2 flex items-center justify-center gap-2 lg:hidden ${showTagsDropdown && "shadow-md shadow-custom-black"}`}
      >
        Tags
        <ArrowDropDownIcon
          fontSize="small"
          className="rounded-full bg-custom-gray text-custom-less-gray"
        />
      </button>

      {/* Tags Dropdown for Mobile */}
      {showTagsDropdown && (
        <div className="absolute rounded top-full mt-1 w-full bg-custom-less-gray z-10 shadow-md shadow-custom-black">
          {TAGS.map((item, index) => (
            <div key={item.label}>
              <div className="flex items-center gap-2 py-1 px-2 text-xs font-medium hover:bg-custom-less-gray">
                <span className={`h-3 w-3 bg-${item.color}`}></span>
                <h6>{item.label}</h6>
              </div>
              {index < TAGS.length - 1 && <hr className="my-1" />}
            </div>
          ))}
        </div>
      )}

      {/* Inline Tags for Larger Screens */}
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

export default Tags;
