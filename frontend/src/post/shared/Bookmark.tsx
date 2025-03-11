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
import Button from "shared/utils/form/Button";
import { RESPONSE_DB } from "shared/shared-db";
import { ISectionKey } from "post/db";

interface IBookmark {
  section: ISectionKey;
  postId: string;
  isSaved: boolean;
  classProp?: string;
}

const Bookmark: React.FC<IBookmark> = ({
  section,
  postId,
  isSaved = false,
  classProp,
}) => {
  const { token } = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch<AppDispatch>();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(isSaved);

  interface MutationVariables {
    url: string;
    bookmarkState: boolean;
  }

  // Sync local state with prop changes
  React.useEffect(() => {
    setIsBookmarked(isSaved);
  }, [isSaved]);

  const mutation = useMutation({
    mutationFn: async ({ url, bookmarkState }: MutationVariables) => {
      // Optimistically update the bookmark state.
      setIsBookmarked(bookmarkState);
      const response = await axiosInstance.post(url, {
        section,
        post_id: postId,
      });
      return response.data;
    },
    onSuccess: ({ message }, { bookmarkState }) => {
      setIsBookmarked(bookmarkState);
      dispatch(triggerSuccessMsg(message || "Bookmark updated!"));
    },
    onError: (error: any, { bookmarkState }) => {
      // Revert back to the previous state on error.
      setIsBookmarked(!bookmarkState);
      dispatch(
        triggerErrorMsg(
          error.response?.data?.message || "Bookmark not updated, try again!"
        )
      );
    },
  });

  const handleClick = () => {
    if (token) {
      const bookmarkState = !isBookmarked;
      const url = bookmarkState
        ? "user/account/post/bookmark"
        : "user/account/post/un-bookmark";

      mutation.mutate({ url, bookmarkState });
    } else {
      dispatch(triggerErrorMsg(RESPONSE_DB.not_authenticated));
    }
  };

  return (
    <div className={classProp}>
      <Button iconButton onClick={handleClick} disabled={mutation.isPending}>
        {isBookmarked ? (
          <BookmarkSharpIcon fontSize="small" />
        ) : (
          <BookmarkBorderSharpIcon fontSize="small" />
        )}
      </Button>
    </div>
  );
};

export default Bookmark;
