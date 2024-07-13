import React, { useEffect, useState } from "react";
import SavedItem from "../components/item/SavedItem";
import { useHttpClient } from "src/shared/hooks/http";
import { ExamListItem } from "src/models/exam/ListProps";
import  useAuth  from "src/shared/hooks/auth";
import { useDispatch } from "react-redux";
import { responseUIAction } from "src/shared/store/reponse-ui-slice";
import "./Saved.css";
import Filter from "src/shared/components/utils/Filter";

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
