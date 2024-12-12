import { IPostList } from "models/postModels/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostList from "shared/components/PostList";
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

  console.log(data);

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
      {Object.keys(savedPost).map((key, index) => {
        const isLastSection = index === Object.keys(savedPost).length - 1;
        return (
          savedPost[key].length > 0 && (
            <Fragment key={key}>
              <h2 className="w-fit py-1 text-custom-gray font-bold px-2 mt-3">{startCase(key)}</h2>
              <div className="pl-2">
                <PostList data={savedPost[key]} section={key} isSaved />
              </div>
              {!isLastSection && (
                <hr className="w-full border-t-1 border-custom-less-gray" />
              )}
            </Fragment>
          )
        );
      })}
    </div>
  );
};

export default SavedPosts;
