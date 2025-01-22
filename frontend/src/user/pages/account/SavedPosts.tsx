import { IPostList } from "models/postModels/IPost";
import axiosInstance from "shared/utils/api/axios-instance";
<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";
import PostList from "shared/sharedPostComponents/PostList";
=======
import { useQuery } from "@tanstack/react-query"; 
import PostList from "post/postShared/PostList";
>>>>>>> user
import { Fragment } from "react/jsx-runtime";
import { startCase } from "lodash";
import NoData from "shared/components/dataStates/NoData";

const fetchSavedPosts = async (): Promise<{
  data: { saved_posts: { [key: string]: IPostList } };
}> => {
  const response = await axiosInstance.get("user/account/post/saved-posts");
  return response.data;
};

const SavedPosts = () => {
  const { data = { data: { saved_posts: {} } }, isLoading } = useQuery<
    { data: { saved_posts: { [key: string]: IPostList } } },
    Error
  >({
    queryKey: ["savedPosts"],
    queryFn: fetchSavedPosts,
  });

  const savedPost = data?.data?.saved_posts || {};

  if (isLoading) {
    return <PostList data={[]} section="" isSaved />;
  }

  if (!isLoading && Object.keys(savedPost).length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-2">
      {Object.keys(savedPost).map((key) => {
<<<<<<< HEAD
=======
        const posts = savedPost[key];
>>>>>>> user
        return (
          posts.length > 0 &&
          Array.isArray(posts) && (
            <Fragment key={key}>
<<<<<<< HEAD
              <h2 className="w-fit py-1 text-custom-gray font-bold px-2 mt-3 text-lg">
                {startCase(key)}
              </h2>
=======
              <h2 className="self-start">{startCase(key)}</h2>
>>>>>>> user
              <div className="pl-2">
                <PostList data={posts || []} section={key} isSaved />
              </div>
            </Fragment>
          )
        );
      })}
    </div>
  );
};

export default SavedPosts;
