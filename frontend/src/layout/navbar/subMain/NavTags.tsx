import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { startCase } from "lodash";

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

  const baseClass = `text-sm px-2 py-[2px] cursor-pointer flex items-center justify-center gap-1`;
  const roundedClass = showTagsDropdown ? "py-2" : "rounded";
  const activeClass = isActive ? "bg-custom_white" : "hover:bg-custom_white";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${roundedClass} ${activeClass}`}
    >
      <span className={`h-3 w-3 rounded-sm bg-${color}`} />
      <span>{startCase(label)}</span>
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
      className="relative min-w-[6.5rem] h-fit flex items-center"
    >
      {tagButtonShow ? (
        <Button
          navButton
          onClick={() => dispatch(toggleDropdownState({ id: dropdownKey }))}
          className={`${
            showTagsDropdown
              ? "bg-custom_less_gray"
              : "hover:bg-custom_less_gray"
          } ${viewType === "mobile" ? "py-[2px]" : ""}`}
        >
          Tags
          {showTagsDropdown ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </Button>
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
