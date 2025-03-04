import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch } from "react-redux";
import { AppDispatch } from "shared/store";
import { resetKeyValuePairs, setEditContribute } from "shared/store/post-slice";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";

const useContributeMutation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const contributeMutation = useMutation({
    mutationFn: async ({
      keyValuePairs,
      section,
      postCode,
    }: {
      keyValuePairs: Record<string, any>;
      section: string;
      postCode: string;
    }) => {
      const response = await axiosInstance.post(
        "/user/account/post/contribute-to-post",
        {
          data: keyValuePairs,
          section,
          post_code: postCode,
        }
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(
        triggerSuccessMsg(message || "Contributed to post successfully!")
      );
      dispatch(resetKeyValuePairs());
      dispatch(
        setEditContribute({ clicked: false, section: "", postCode: "" })
      );
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Failed to contribute!"
        )
      );
    },
  });

  //sending postcode, section, user id through token and now make the update by deleting the data.
  const deleteContributeMutation = useMutation({
    mutationFn: async (data: { post_code: string; section: string }) => {
      const response = await axiosInstance.patch(
        "/user/account/post/delete-contribution",
        data
      );
      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message || "Contribution deleted!"));
    },
    onError: (error: any) => {
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Contribution deletion failed!"
        )
      );
    },
  });

  return { contributeMutation, deleteContributeMutation };
};

export default useContributeMutation;
