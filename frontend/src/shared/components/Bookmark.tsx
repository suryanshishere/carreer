import React from "react";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "shared/store";
import {
  triggerErrorMsg,
  triggerSuccessMsg,
} from "shared/store/thunks/response-thunk";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import BookmarkSharpIcon from "@mui/icons-material/BookmarkSharp";

interface IBookmark {
  category: string;
  postId: string;
  isSaved: boolean;
}

const Bookmark: React.FC<IBookmark> = ({ category, postId, isSaved }) => {
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

  if (isSaved || mutation.isSuccess) {
    return (
      <div className="float-right flex mt-1">
        <button
          className="relative text-custom-super-less-gray text-xs bg-transparent border-none cursor-pointer transition-all hover:font-semibold"
          onMouseEnter={(e) => (e.currentTarget.textContent = "Unsave")}
          onMouseLeave={(e) => (e.currentTarget.textContent = "Saved")}
          onClick={() => {
            // Add logic to handle "Unsave" action here
          }}
        >
          Saved
        </button>
      </div>
    );
  }
  return (
    <>
      {!mutation.isSuccess && (
        <div className="float-right flex items-center justify-center rounded-full hover:bg-custom-pale-yellow">
          <BookmarkBorderSharpIcon
            onClick={() => mutation.mutate()}
            fontSize="small"
            className={`cursor-pointer text-custom-super-less-gray hover:text-custom-gray ${
              mutation.isPending && "text-custom-gray"
            }`}
          />
        </div>
      )}
    </>
  );
};

export default Bookmark;
