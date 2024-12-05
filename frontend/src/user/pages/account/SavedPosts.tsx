import { IPostList } from "models/postModels/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const fetchSavedPosts = async (
  token: string = ""
): Promise<IPostList> => {
  const response = await axiosInstance.get("user/account/post/saved-posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const SavedPosts = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);

  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostList, Error>({
    queryKey: ["savedPosts"],
    queryFn: () => fetchSavedPosts(token),
  });

  console.log(data);

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="flex gap-3">{/* <SavedItem savedExamData={data} /> */}</div>
  );
};

export default SavedPosts;
