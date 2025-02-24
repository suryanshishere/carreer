import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import Button from "shared/utils/form/Button";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import { Link } from "react-router-dom"; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { resetKeyValuePairs, setEditContribute } from "shared/store/post-slice";
import { startCase } from "lodash";
import useContributeMutation from "post/post_shared/contribution-hook";

type SubContriHeaderProps = {
  section: string;
  postCode: string;
  isEditing: boolean;
};

const SubContriHeader: React.FC<SubContriHeaderProps> = ({
  section,
  postCode,
  isEditing,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditContribute, isAllKeyValuePairsStored, keyValuePairs } =
    useSelector((state: RootState) => state.post);

  const { contributeMutation, deleteContributeMutation } = useContributeMutation();
  
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 justify-center">
        <h2 className="pl-0">{startCase(section)}</h2>
        <Link
          to={`/sections/${section}/${postCode.toLowerCase()}`}
          className="text-custom-red hover:text-custom-blue flex items-center justify-center p-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <OpenInNewOutlinedIcon fontSize="small" />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {isEditContribute.clicked && isEditing ? (
          <Button
            basicButton
            onClick={() => {
              dispatch(resetKeyValuePairs());
              dispatch(
                setEditContribute({
                  clicked: false,
                  section: "",
                  postCode: "",
                })
              );
            }}
            classProp="text-sm"
          >
            Undo
          </Button>
        ) : (
          <Button
            iconButton
            onClick={() => {
              dispatch(
                setEditContribute({
                  clicked: true,
                  section,
                  postCode,
                })
              );
            }}
          >
            <EditSharpIcon fontSize="small" />
          </Button>
        )}
        {isAllKeyValuePairsStored && isEditing && (
          <Button
            onClick={() => {
              contributeMutation.mutate({
                keyValuePairs,
                section,
                postCode,
              });
            }}
            disabled={contributeMutation.isPending}
            authButtonType
            classProp="text-sm p-0 px-2 py-1 "
          >
            {contributeMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        )}
        <Button
          iconButton
          onClick={() =>
            deleteContributeMutation.mutate({
              post_code: postCode,
              section: section,
            })
          }
          classProp="ml-4"
        >
          <DeleteOutlineIcon fontSize="small" />
        </Button>
      </div>
    </div>
  );
};

export default SubContriHeader;
