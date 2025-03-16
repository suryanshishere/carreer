import React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import useOutsideClick from "shared/hooks/outside-click-hook";
import useResponsiveView, { IView } from "shared/hooks/useResponsiveView";
import Button from "shared/utils/form/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { updateMode } from "shared/store/userSlice";
import { USER_ACCOUNT_MODE_DB } from "users/db";
import { IUserAccountMode } from "users/db";
import NavDropdownUI from "shared/ui/NavDropdownUI";
import { toggleDropdownState } from "shared/store/dropdownSlice";
import { ClassNames } from "@emotion/react";

const TAGS = USER_ACCOUNT_MODE_DB.tags;

interface TagButtonProps {
  label: string;
  color: string;
  isActive: boolean;
  showTagsDropdown?: boolean;
  className?: string;
  onClick: () => void;
}

const TagButton: React.FC<TagButtonProps> = ({
  label,
  color,
  isActive,
  onClick,
  showTagsDropdown,
}) => {
  if (label === "none") return null;

  const className = `flex justify-center items-center gap-1 text-xs font-medium ${
    showTagsDropdown ? "rounded py-2" : "rounded-full"
  } py-1 px-2 cursor-pointer hover:bg-custom_white uppercase`;

  const buttonContent = (
    <>
      <span className={`h-3 w-3 rounded-sm bg-${color}`}></span>
      <span>{label}</span>
    </>
  );

  return isActive ? (
    <button onClick={onClick} className={`bg-custom_white ${className}`}>
      {buttonContent}
    </button>
  ) : (
    <button onClick={onClick} className={className}>
      {buttonContent}
    </button>
  );
};

const NavTags: React.FC = () => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const dropdownKey = "nav_tags";
  const showTagsDropdown = useSelector(
    (state: RootState) => state.dropdown.dropdownStates[dropdownKey]
  );

  // Use useSelector to get the current tags state from Redux
  const currentTags = useSelector(
    (state: RootState) => state.user.mode.tags || {}
  );

  useOutsideClick(dropdownRef, () =>
    dispatch(toggleDropdownState({ id: dropdownKey, bool: false }))
  );

  const tagClickHandler = (tagsKey: keyof IUserAccountMode["tags"]) => {
    dispatch(
      updateMode({
        tags: {
          [tagsKey]: !currentTags[tagsKey],
        },
      })
    );
  };

  const viewType: IView = useResponsiveView();
  const tagButtonShow =
    viewType === "large_mobile" ||
    viewType === "medium_mobile" ||
    viewType === "mobile";

  return (
    <div
      ref={dropdownRef}
      className="relative min-w-28 h-fit flex items-center"
    >
      {tagButtonShow ? (
        <button
          onClick={() => dispatch(toggleDropdownState({ id: dropdownKey }))}
          className={`rounded-full outline outline-custom_gray w-full h-full bg-custom_less_gray flex items-center justify-center gap-2 ${
            viewType === "mobile" ? "py-1" : "py-[1px]"
          } ${showTagsDropdown && "shadow-md shadow-custom_black"}`}
        >
          Tags
          <ArrowDropDownIcon fontSize="small" />
        </button>
      ) : (
        <div className="flex items-center gap-1">
          {Object.entries(TAGS)
            .filter(([tagsKey]) => tagsKey !== "none")
            .map(([tagsKey, item]) => (
              <TagButton
                key={tagsKey}
                label={tagsKey}
                color={item ?? ""}
                isActive={
                  currentTags[tagsKey as keyof IUserAccountMode["tags"]]
                }
                className="rounded-full"
                onClick={() =>
                  tagClickHandler(tagsKey as keyof IUserAccountMode["tags"])
                }
              />
            ))}
        </div>
      )}

      <NavDropdownUI isVisible={showTagsDropdown}>
        {Object.entries(TAGS)
          .filter(([tagsKey]) => tagsKey !== "none")
          .map(([tagsKey, item]) => (
            <TagButton
              key={tagsKey}
              label={tagsKey}
              color={item ?? ""}
              isActive={currentTags[tagsKey as keyof IUserAccountMode["tags"]]}
              onClick={() =>
                tagClickHandler(tagsKey as keyof IUserAccountMode["tags"])
              }
              showTagsDropdown
            />
          ))}
      </NavDropdownUI>
    </div>
  );
};

export default NavTags;
