import React, { useContext } from "react";
import SavedItem from "../components/item/SavedItem";
import { IPostListData } from "models/post/IPostList";
import useUserData from "shared/utilComponents/hooks/user-data-hook";
import axiosInstance from "shared/utilComponents/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { ResponseContext } from "shared/utilComponents/context/response-context";
import handleQueryStates from "shared/uiComponents/quick/handle-query-states";
import "./Saved.css";

// Fetch function to get saved exams
const fetchSavedPosts = async (
  userId: string = "",
  token: string = ""
): Promise<IPostListData[]> => {
  const response = await axiosInstance.get(`/users/${userId}/saved_exam`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const Saved = () => {
  const response = useContext(ResponseContext);
  const { token, userId } = useUserData();

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<IPostListData[], Error>({
    queryKey: ["savedPosts"],
    queryFn: () => fetchSavedPosts(userId, token),
  });

  const queryState = handleQueryStates(isLoading, error, data, response);
  if (queryState) return queryState;

  return (
    <div className="flex gap-3">
      <SavedItem savedExamData={data} />
    </div>
  );
};

export default Saved;
