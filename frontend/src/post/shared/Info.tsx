import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { toggleDropdownState } from "shared/store/dropdown-slice";
import { useParams } from "react-router-dom";
import ContributeToPost from "post/components/ContributeToPost";

const Info = () => {
  const { section = "", postCode = "" } = useParams<{
    section: string;
    postCode: string;
  }>();
  const dispatch = useDispatch<AppDispatch>();
  const dropdownStates = useSelector(
    (state: RootState) => state.dropdown.dropdownStates
  );
  const showInfoDropdown = dropdownStates["info"] || false;

  return (
    <div className="relative flex justify-center items-center gap-1">
      <div className="relative">
        {showInfoDropdown && (
          <div className="bg-custom-pale-yellow px-2 py-1">
            <ContributeToPost section={section} postCode={postCode} />
          </div>
        )}
      </div>

      <button
        onClick={() => {
          dispatch(toggleDropdownState("info"));
        }}
        className={
          "p-1 m-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-custom-pale-yellow"
        }
      >
        {!showInfoDropdown ? (
          <InfoOutlinedIcon
            fontSize="small"
            className="text-custom-super-less-gray hover:text-custom-gray"
          />
        ) : (
          <InfoSharpIcon fontSize="small" className="text-custom-gray" />
        )}
      </button>
    </div>
  );
};

export default Info;
