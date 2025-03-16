import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { resetKeyValuePairs, setEditPostClicked } from "shared/store/postSlice";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";
import Button from "shared/utils/form/Button";
import useOutsideClick from "shared/hooks/outside-click-hook";
import { closeSpecificDropdowns } from "shared/store/dropdownSlice";
import useContributeMutation from "posts/shared/useContributionMutation";
import { RESPONSE_DB } from "shared/db";
import { ISectionKey } from "posts/db";

const ContributeToPost: React.FC<{
  section: ISectionKey;
  postCode: string;
  version: string;
}> = ({ section, postCode, version = "main" }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditPostClicked, isAllKeyValuePairsStored, keyValuePairs } =
    useSelector((state: RootState) => state.post);

  const { token, role } = useSelector(
    (state: RootState) => state.user.userData
  );

  useEffect(() => {
    if (section && postCode) {
      dispatch(setEditPostClicked(false));
    }
  }, [dispatch, section, postCode]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => {
    if (!isEditPostClicked) {
      dispatch(closeSpecificDropdowns(["info"]));
    }
  });

  const { contributeMutation } = useContributeMutation();

  const contributePostHandler = () => {
    if (token) {
      dispatch(setEditPostClicked(true));
    } else {
      dispatch(triggerErrorMsg(RESPONSE_DB.not_authenticated));
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="text-sm absolute right-full mr-1 flex items-center gap-1"
    >
      {!isEditPostClicked ? (
        <Button basicButton onClick={contributePostHandler}>
          Contribute To This Post
        </Button>
      ) : (
        <Button basicButton onClick={() => dispatch(resetKeyValuePairs())}>
          Undo
        </Button>
      )}
      {isAllKeyValuePairsStored && (
        <Button
          onClick={() => {
            contributeMutation.mutate({
              keyValuePairs,
              section,
              postCode,
              version,
            });
          }}
          disabled={contributeMutation.isPending}
          authButtonType
          className="whitespace-nowrap text-sm p-0 px-2 py-1"
        >
          {contributeMutation.isPending
            ? role === "none" || role === "publisher"
              ? "Submitting..."
              : "Applying..."
            : role === "none" || role === "publisher"
            ? "Submit"
            : "Apply Changes"}{" "}
        </Button>
      )}
    </div>
  );
};

export default ContributeToPost;
