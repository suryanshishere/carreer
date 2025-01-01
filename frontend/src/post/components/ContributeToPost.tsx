import React, { useEffect } from "react";
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

  useEffect(() => {
    if (section && postCode) {
      dispatch(setEditPostClicked(false)); // Reset edit state on component mount
    }
  }, [dispatch, section, postCode]);

  const mutation = useMutation({
    mutationFn: async (keyValuePairs: Record<string, any>) => {
      console.log(keyValuePairs);
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
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to contribute!"
        )
      );
    },
  });

  return (
    <>
      {!isEditPostClicked ? (
        <button onClick={() => dispatch(setEditPostClicked(true))} className="">
          Contribute to post
        </button>
      ) : (
        <button onClick={() => dispatch(resetKeyValuePairs())}>Undo</button>
      )}
      {isAllKeyValuePairsStored && (
        <button
          onClick={() => {
            mutation.mutate(keyValuePairs);
          }}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      )}
    </>
  );
};

export default ContributeToPost;
