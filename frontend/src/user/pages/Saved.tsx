import React, { useEffect, useState } from "react";
import SavedItem from "../components/item/SavedItem";
import { useHttpClient } from "shared/hooks/http-hook";
import { ExamListItem } from "models/exam/ListProps";
import  useAuth  from "shared/hooks/auth-hook";
import { useDispatch } from "react-redux";
import { responseUIAction } from "shared/store/reponse-ui-slice";
import "./Saved.css";
import Filter from "shared/components/utils/Filter";

const Saved = () => {
  const { sendRequest, clearError, isLoading, error } = useHttpClient();
  const [savedExam, setSavedExam] = useState<ExamListItem[]>([]);
  const { token, userId } = useAuth();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responseUIAction.setErrorHandler(error));
    dispatch(responseUIAction.isLoadingHandler(isLoading));
  }, [error, isLoading, clearError, dispatch]);

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
        const responseData = response.data as unknown as ExamListItem[];
        setSavedExam(responseData);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, token, userId]);

  return (
    <div className="flex gap-3">
      <SavedItem savedExamData={savedExam} />
      <Filter noAnimation data={savedExam}/>
    </div>
  );
};

export default Saved;
