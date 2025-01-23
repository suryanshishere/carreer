import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  resetKeyValuePairs,
  setEditPostClicked,
} from "shared/store/post-slice";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axiosInstance from "shared/utils/api/axios-instance";
import { useMutation } from "@tanstack/react-query";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import Button from "shared/utils/form/Button";
import useOutsideClick from "shared/hooks/outside-click-hook";
import {
  closeSpecificDropdowns, 
} from "shared/store/dropdown-slice";
import RESPONSE_DB from "db/response-db";

interface IContributeToPost {
  section: string;
  postCode: string;
}

const ContributeToPost: React.FC<IContributeToPost> = ({
  section,
  postCode,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditPostClicked, isAllKeyValuePairsStored, keyValuePairs } =
    useSelector((state: RootState) => state.post);

  const token = useSelector((state: RootState) => state.auth.userData.token);

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

  const mutation = useMutation({
    mutationFn: async (keyValuePairs: Record<string, any>) => {
      const response = await axiosInstance.post("/user/contribute-to-post", {
        data: keyValuePairs,
        section,
        post_code: postCode,
      });
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(
        triggerSuccessMsg(message || "Contributed to post successfully!")
      );
      dispatch(resetKeyValuePairs());
      dispatch(closeSpecificDropdowns(["info"]));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to contribute!"
        )
      );
    },
  });

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
        <button
          onClick={contributePostHandler}
          className="whitespace-nowrap hover:bg-custom-less-gray transform duration-100 ease-linear px-2 py-1 rounded"
        >
          Contribute To This Post
        </button>
      ) : (
        <button
          onClick={() => dispatch(resetKeyValuePairs())}
          className="whitespace-nowrap hover:bg-custom-less-gray transform duration-100 ease-linear px-2 py-1 rounded"
        >
          Undo
        </button>
      )}
      {isAllKeyValuePairsStored && (
        <Button
          onClick={() => {
            mutation.mutate(keyValuePairs);
          }}
          disabled={mutation.isPending}
          authButtonType
          classProp="whitespace-nowrap text-sm p-0 px-2 py-1  "
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </Button>
      )}
    </div>
  );
};

export default ContributeToPost;
