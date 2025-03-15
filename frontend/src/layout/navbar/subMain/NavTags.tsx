import React, { useRef, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useOutsideClick from "shared/hooks/outside-click-hook";
import useResponsiveView, {
  viewObject,
  ViewType,
} from "shared/hooks/useResponsiveView";
import Button from "shared/utils/form/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { updateMode } from "shared/store/userSlice";
import { USER_ACCOUNT_MODE_DB } from "users/db";
import { IUserAccountMode } from "users/db";

const TAGS = USER_ACCOUNT_MODE_DB.tags;

interface TagButtonProps {
  label: string;
  color: string;
  isActive: boolean;
  className: string;
  onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({
  label,
  color,
  isActive,
  className="",
  onClick,
}) => {
  // For visited tag - future perspective and feature in look pending
  if (label === "none") {
    return (
      <span
        // basicButton
        className={`flex items-center justify-center gap-1 text-xs font-medium select-none hover:bg-none px-1 py-1 uppercase ${className}`}
      >
        <span className="h-3 w-3 rounded-full bg-custom_black"></span>
        <span>VISITED</span>
      </span>
    );
  }

  return (
    <Button
      basicButton
      onClick={onClick}
      className={`flex items-center gap-1 text-xs font-medium hover:bg-custom_white uppercase ${
        isActive ? "bg-custom_white" : ""
      } ${className}`}
    >
      <span className={`h-3 w-3 rounded-full bg-${color}`}></span>
      <span>{label}</span>
    </Button>
  );
};

const NavTags: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Use useSelector to get the current tags state from Redux
  const currentTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );

  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  useOutsideClick(dropdownRef, () => setShowTagsDropdown(false));

  const tagClickHandler = (tagsKey: keyof IUserAccountMode["tags"]) => {
    dispatch(
      updateMode({
        tags: {
          [tagsKey]: !currentTags[tagsKey],
        },
      })
    );
  };

  const viewType: ViewType = useResponsiveView(viewObject);
  const tagButtonShow =
    viewType === "tablet" ||
    viewType === "large_mobile" ||
    viewType === "medium_mobile" ||
    viewType === "mobile";

  return (
    <div ref={dropdownRef} className="relative min-w-28 h-fit flex items-center">
      {tagButtonShow ? (
        <button
          onClick={() => setShowTagsDropdown(!showTagsDropdown)}
          className={`rounded-full outline outline-custom_gray w-full h-full bg-custom_less_gray flex items-center justify-center gap-2 ${
            viewType === "mobile" ? "py-1" : "py-[1px]"
          } ${showTagsDropdown && "shadow-md shadow-custom_black"}`}
        >
          Tags
          <ArrowDropDownIcon
            fontSize="small" 
          />
        </button>
      ) : (
        <div className="flex items-center gap-1">
          {Object.entries(TAGS).map(([tagsKey, item]) => (
            <TagButton
              key={tagsKey}
              label={tagsKey}
              color={item ?? ""}
              isActive={currentTags[tagsKey as keyof IUserAccountMode["tags"]]}
              className="rounded-full"
              onClick={() =>
                tagClickHandler(tagsKey as keyof IUserAccountMode["tags"])
              }
            />
          ))}
        </div>
      )}

      {showTagsDropdown && (
        <div className="absolute rounded top-full mt-1 w-full bg-custom_less_gray z-10 shadow-md shadow-custom_black p-1">
          {Object.entries(TAGS).map(([tagsKey, item], index, array) => (
            <React.Fragment key={tagsKey}>
              <TagButton
                label={tagsKey}
                color={item ?? ""}
                isActive={
                  currentTags[tagsKey as keyof IUserAccountMode["tags"]]
                }
                className="justify-center py-2"
                onClick={() =>
                  tagClickHandler(tagsKey as keyof IUserAccountMode["tags"])
                }
              />
              {index < array.length - 1 && <hr className="my-1" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavTags;
