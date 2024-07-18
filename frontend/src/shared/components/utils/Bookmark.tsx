import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "../../hooks/http-hook";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import { getUserData } from "shared/localStorageConfig/auth-local-storage";

interface BookmarkProps {
  itemId: string | number;
  bookmarked?: boolean;
}

const Bookmark: React.FC<BookmarkProps> = ({ itemId, bookmarked }) => {
  const { sendRequest, error, isLoading } = useHttpClient();
  const userData = getUserData();
  const { userId, token, emailVerified, sessionExpireMsg } = userData;
  const [isBookmarked, setIsBookmarked] = useState<boolean | undefined>(
    bookmarked
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, dispatch]);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const toggleBookmark = useCallback(
    async (method: string) => {
      if (!userId || !token) {
        setIsBookmarked(false);

        dispatch(
          responseUIAction.setErrorHandler(
            "Please sign up or log in to save this exam to your account."
          )
        );
      } else {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BASE_URL}/users/${userId}/save_exam`,
            method,
            JSON.stringify({ examId: itemId }),
            {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            }
          );
          dispatch(
            responseUIAction.setResponseHandler(responseData.data.message)
          );
        } catch (err) {
          setIsBookmarked(false);
        }
      }
    },
    [dispatch, itemId, sendRequest, token, userId]
  );

  const bookmarkHandler = useCallback(() => {
    setIsBookmarked((prevState) => !prevState);
    toggleBookmark(isBookmarked ? "DELETE" : "POST");
  }, [isBookmarked, toggleBookmark]);

  return (
    <IconButton onClick={bookmarkHandler} size="small">
      {!isBookmarked ? <BookmarkBorderOutlinedIcon /> : <BookmarkIcon />}
    </IconButton>
  );
};

export default Bookmark;
