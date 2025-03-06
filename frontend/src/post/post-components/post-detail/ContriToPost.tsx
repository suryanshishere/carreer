import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  resetKeyValuePairs,
  setEditPostClicked,
} from "shared/store/postSlice";
import { triggerErrorMsg } from "shared/store/thunks/response-thunk";
import Button from "shared/utils/form/Button";
import useOutsideClick from "shared/hooks/outside-click-hook";
import { closeSpecificDropdowns } from "shared/store/dropdownSlice"; 
import useContributeMutation from "post/post-shared/useContributionMutation";
import { RESPONSE_DB } from "shared/shared-db";

const ContriToPost: React.FC<{
  section: string;
  postCode: string;
}> = ({ section, postCode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditPostClicked, isAllKeyValuePairsStored, keyValuePairs } =
    useSelector((state: RootState) => state.post);

  const token = useSelector((state: RootState) => state.user.userData.token);

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
            contributeMutation.mutate({ keyValuePairs, section, postCode });
          }}
          disabled={contributeMutation.isPending}
          authButtonType
          classProp="whitespace-nowrap text-sm p-0 px-2 py-1"
        >
          {contributeMutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      )}
    </div>
  );
};

export default ContriToPost;
