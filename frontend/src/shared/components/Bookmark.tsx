import React, { useState } from "react";
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
  section: string;
  postId: string;
  isSaved: boolean;
}

const Bookmark: React.FC<IBookmark> = ({ section, postId, isSaved }) => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch<AppDispatch>();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(isSaved);

  interface MutationVariables {
    url: string;
    bookmarkState: boolean;
  }

  const handleMutation = async ({ url, bookmarkState }: MutationVariables) => {
    setIsBookmarked(bookmarkState);
    const response = await axiosInstance.post(
      url,
      { section, post_id: postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const mutation = useMutation<any, any, MutationVariables>({
    mutationFn: handleMutation,
    onSuccess: ({ message }, { bookmarkState }) => {
      setIsBookmarked(bookmarkState);
      dispatch(triggerSuccessMsg(message));
    },
    onError: (error: any, { bookmarkState }) => {
      setIsBookmarked(!bookmarkState); // Revert state on error
      dispatch(triggerErrorMsg(`${error.response?.data?.message}`));
    },
  });

  const handleClick = (url: string, bookmarkState: boolean) => {
    mutation.mutate({ url, bookmarkState });
  };

  const bookmarkButtonProps = {
    className: "p-1 m-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-custom-pale-yellow",
    disabled: mutation.isPending,
  };

  return (
    <div className="flex items-center">
      {isBookmarked ? (
        <button
          {...bookmarkButtonProps}
          onClick={() => handleClick("user/account/post/un-bookmark", false)}
        >
          <BookmarkSharpIcon
            fontSize="small"
            className="text-custom-super-less-gray hover:text-custom-gray"
          />
        </button>
      ) : (
        <button
          {...bookmarkButtonProps}
          onClick={() => handleClick("user/account/post/bookmark", true)}
        >
          <BookmarkBorderSharpIcon
            fontSize="small"
            className="text-custom-super-less-gray hover:text-custom-gray"
          />
        </button>
      )}
    </div>
  );
};

export default Bookmark;
