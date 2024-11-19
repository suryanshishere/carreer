import SavedItem from "../components/item/SavedItem";
import { IPostListData } from "models/post/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
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
    const { token, userId } = useSelector(
    (state: RootState) => state.auth.userData
  );

  const {
    data = [],
    isLoading,
    error,
  } = useQuery<IPostListData[], Error>({
    queryKey: ["savedPosts"],
    queryFn: () => fetchSavedPosts(userId, token),
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;
  
  return (
    <div className="flex gap-3">
      <SavedItem savedExamData={data} />
    </div>
  );
};

export default Saved;
