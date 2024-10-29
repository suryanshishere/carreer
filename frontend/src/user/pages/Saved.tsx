import React, { useEffect, useState } from "react";
import SavedItem from "../components/item/SavedItem";
import { useHttpClient } from "shared/utilComponents/hooks/http-hook";
import { IPostListData } from "models/post/IPostList";
import { useDispatch } from "react-redux";
import { dataStatusUIAction } from "shared/utilComponents/store/data-status-ui";
import "./Saved.css";
import Filter from "shared/utilComponents/utilPost/Filter";
import useUserData from "shared/utilComponents/hooks/user-data-hook";

const Saved = () => {
  const { sendRequest, clearError, error } = useHttpClient();
  const [savedExam, setSavedExam] = useState<IPostListData[]>([]);
  const { token, userId } = useUserData();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(dataStatusUIAction.setErrorHandler(error));
  }, [error,  dispatch]);

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
        const responseData = response.data as unknown as IPostListData[];
        setSavedExam(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, token, userId]);

  if (savedExam.length === 0) return null;

  return (
    <div className="flex gap-3">
      <SavedItem savedExamData={savedExam} />
      <Filter noAnimation data={savedExam} />
    </div>
  );
};

export default Saved;
