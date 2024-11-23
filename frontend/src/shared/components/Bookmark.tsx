import React from "react";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";

interface IBookmark {
  category: string;
  postId: string;
}

const Bookmark: React.FC<IBookmark> = ({ category, postId }) => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        "user/account/post/bookmark",
        JSON.stringify({ category, post_id: postId }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    onSuccess: ({ message }) => {
      dispatch(triggerSuccessMsg(message));
    },
    onError: (error: any) => {
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  return (
    <div
      className="text-center flex items-center justify-center rounded-full hover:bg-custom-pale-yellow"
      onClick={() => mutation.mutate()}
    >
      <BookmarkBorderSharpIcon
        fontSize="small"
        className="cursor-pointer text-custom-super-less-gray hover:text-custom-gray"
      />
    </div>
  );
};

export default Bookmark;
