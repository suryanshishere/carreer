import SavedItem from "../components/item/SavedItem";
import { IPostListData } from "models/post/IPostList";
import useUserData from "shared/hooks/user-data-hook";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
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
  const { token, userId } = useUserData();

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
