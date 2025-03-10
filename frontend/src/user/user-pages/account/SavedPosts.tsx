import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import PostList from "post/shared/PostList";
import { Fragment } from "react/jsx-runtime";
import { startCase } from "lodash"; 
import PageHeader from "shared/ui/PageHeader";
import { ICommonListData } from "post/db/interfaces"; 
import DataStateWrapper from "shared/components/DataStateWrapper";

const fetchSavedPosts = async (): Promise<{
  data: { saved_posts: { [key: string]: ICommonListData[] } };
}> => {
  const response = await axiosInstance.get("/user/account/post/saved-posts");
  return response.data;
};

const SavedPosts = () => {
  const { data: queryData, isLoading, error } = useQuery<
    { data: { saved_posts: { [key: string]: ICommonListData[] } } },
    Error
  >({
    queryKey: ["savedPosts"],
    queryFn: fetchSavedPosts,
  });

  // Default to an empty object if no data is returned
  const savedPosts = queryData?.data?.saved_posts || {};

  return (
    <DataStateWrapper
      isLoading={isLoading}
      error={error}
      data={savedPosts}
      // Consider the data empty if there are no keys in the saved posts object
      emptyCondition={(data) => Object.keys(data).length === 0}
      // Use the original loading UI
      loadingComponent={<PostList data={[]} section="" />} 
    >
      {(data) => (
        <div className="flex flex-col gap-2">
          <PageHeader
            header="Saved Bookmarks"
            subHeader="Quick access to your interested post"
          />
          {data && Object.keys(data).map((key) => {
            const posts = data[key];
            return (
              posts.length > 0 &&
              Array.isArray(posts) && (
                <Fragment key={key}>
                  <h2 className="self-start whitespace-nowrap">
                    {startCase(key)}
                  </h2>
                  <PostList data={posts || []} section={key} />
                </Fragment>
              )
            );
          })}
        </div>
      )}
    </DataStateWrapper>
  );
};

export default SavedPosts;
