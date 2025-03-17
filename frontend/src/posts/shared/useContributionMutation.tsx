import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import { resetKeyValuePairs, setEditContribute } from "shared/store/postSlice";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import { ISectionKey } from "posts/db";
import { closeAllDropdowns } from "shared/store/dropdownSlice";

const useContributeMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.user.role);

  const contributeMutation = useMutation({
    mutationFn: async ({
      keyValuePairs,
      section,
      postCode,
      version = "main",
    }: {
      keyValuePairs: Record<string, any>;
      section: ISectionKey;
      postCode: string;
      version: string;
    }) => {
      const response = await axiosInstance.post(
        role !== "publisher" && role !== "none"
          ? "/admin/approver/apply-contri"
          : "/user/account/post/contribute-to-post",
        {
          data: keyValuePairs,
          section,
          post_code: postCode,
          version
        }
      );
      return response.data;
    },
    retry: 3,
    onSuccess: ({ message }) => {
      dispatch(
        triggerSuccessMsg(message || "Contributed to post successfully!")
      );
      dispatch(resetKeyValuePairs());
      dispatch(
        setEditContribute({ clicked: false, section: "", postCode: "" })
      );
      dispatch(closeAllDropdowns());
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
    mutationFn: async ({
      post_code,
      version,
      section,
    }: {
      post_code: string;
      version: string;
      section: ISectionKey;
    }) => {
      const response = await axiosInstance.patch(
        "/user/account/post/delete-contribution",
        {
          post_code,
          version,
          section,
        }
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
