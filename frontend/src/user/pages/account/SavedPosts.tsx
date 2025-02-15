import { IPostList } from "models/postModels/IPost";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import PostList from "post/postShared/PostList";
import { Fragment } from "react/jsx-runtime";
import { startCase } from "lodash";
import NoData from "shared/components/dataStates/NoData";
import PageHeader from "shared/ui/PageHeader";

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
      <PageHeader
        header="Saved Bookmarks"
        subHeader="Quick access to your interested post"
      />
      {Object.keys(savedPost).map((key) => {
        const posts = savedPost[key];
        return (
          posts.length > 0 &&
          Array.isArray(posts) && (
            <Fragment key={key}>
              <h2 className="self-start whitespace-nowrap">{startCase(key)}</h2>
              <PostList data={posts || []} section={key} isSaved />
            </Fragment>
          )
        );
      })}
    </div>
  );
};

export default SavedPosts;
