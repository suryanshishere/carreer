import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { toggleDropdownState } from "shared/store/dropdownSlice";
import { useParams } from "react-router-dom";
import ContributeToPost from "post/post-components/post-detail/ContributeToPost";
import Button from "shared/utils/form/Button";
import { ISectionKey } from "post/post-db";

const Info = () => {
  const {
    section,
    postCode = "",
    version = "main",
  } = useParams<{
    section: ISectionKey;
    postCode: string;
    version: string;
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
        <ContributeToPost section={section as ISectionKey} postCode={postCode} version={version} />
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
