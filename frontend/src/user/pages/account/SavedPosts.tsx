import { IPostList } from "models/postModels/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostList from "post/shared/PostList";
import { Fragment } from "react/jsx-runtime";
import { startCase } from "lodash";

const fetchSavedPosts = async (
  token: string = ""
): Promise<{ data: { saved_posts: { [key: string]: IPostList } } }> => {
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
    data = { data: { saved_posts: {} } },
    isLoading,
    error,
  } = useQuery<{ data: { saved_posts: { [key: string]: IPostList } } }, Error>({
    queryKey: ["savedPosts"],
    queryFn: () => fetchSavedPosts(token),
  });

  const savedPost = data.data.saved_posts;
  const savedPostLength = Object.keys(savedPost).length;
  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: savedPostLength === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(savedPost).map((key) => {
        const data = savedPost[key];
        return (
          data.length > 0 &&
          Array.isArray(data) && (
            <Fragment key={key}>
              <h2 className="mt-3 self-start">{startCase(key)}</h2>
              <div className="pl-2">
                <PostList data={savedPost[key]} section={key} isSaved />
              </div>
            </Fragment>
          )
        );
      })}
    </div>
  );
};

export default SavedPosts;
