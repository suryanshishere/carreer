import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { toggleDropdownState } from "shared/store/dropdown-slice";
import { useParams } from "react-router-dom";
import ContriToPost from "post/post-components/post-detail/contri_to_post";
import Button from "shared/utils/form/Button";

const Info = () => {
  const { section = "", postCode = "" } = useParams<{
    section: string;
    postCode: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );

  const infoButtonHandler = () => {
    dispatch(toggleDropdownState({ id: "info" }));
  };

  return (
    <div className="relative flex justify-center items-center gap-1">
      {dropdownStates["info"] && (
        <ContriToPost section={section} postCode={postCode} />
      )}
      <Button iconButton onClick={infoButtonHandler}>
        {!dropdownStates["info"] ? (
          <InfoOutlinedIcon fontSize="small" />
        ) : (
          <InfoSharpIcon fontSize="small" className="text-custom_gray" />
        )}
      </Button>
    </div>
  );
};

export default Info;
