import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHttpClient } from "../utilComponents/hooks/http-hook";
import { dataStatusUIAction } from "../utilComponents/store/dataStatus-ui-slice";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { IconButton } from "@mui/material";
import useUserData from "../utilComponents/localStorageConfig/use-userData-hook";

interface BookmarkProps {
  itemId: string | number;
  bookmarked?: boolean;
}

const Bookmark: React.FC<BookmarkProps> = ({ itemId, bookmarked }) => {
  const { sendRequest, error } = useHttpClient();
  const { token, userId } = useUserData();
  const [isBookmarked, setIsBookmarked] = useState<boolean | undefined>(
    bookmarked
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  dispatch]);

  useEffect(() => {
    setIsBookmarked(bookmarked);
  }, [bookmarked]);

  const toggleBookmark = useCallback(
    async (method: string) => {
      if (!userId || !token) {
        setIsBookmarked(false);

        dispatch(
          dataStatusUIAction.setErrorHandler(
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
            dataStatusUIAction.setResMsg(responseData.data.message)
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
