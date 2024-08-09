import React, { useEffect, useState } from "react";
import SavedItem from "../components/item/SavedItem";
import { useHttpClient } from "shared/hooks/http-hook";
import { PostData } from "models/post/IPostList";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/store/dataStatus-ui-slice";
import "./Saved.css";
import Filter from "shared/components/utils/Filter";
import useUserData from "shared/localStorageConfig/use-userData-hook";

const Saved = () => {
  const { sendRequest, clearError,  error } = useHttpClient();
  const [savedExam, setSavedExam] = useState<PostData[]>([]);
  const { token,userId } = useUserData();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  clearError, dispatch]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          `${process.env.REACT_APP_BASE_URL}/users/${userId}/saved_exam`,
          "GET",
          null,
          {
            Authorization: "bearer " + token,
          }
        );
        const responseData = response.data as unknown as PostData[];
        setSavedExam(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, token, userId]);

  return (
    <div className="flex gap-3">
      <SavedItem savedExamData={savedExam} />
      <Filter noAnimation data={savedExam} />
    </div>
  );
};

export default Saved;
