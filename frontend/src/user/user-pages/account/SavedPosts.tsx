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
  const {
    data = { data: { saved_posts: {} } },
    isLoading,
    error,
  } = useQuery<
    { data: { saved_posts: { [key: string]: ICommonListData[] } } },
    Error
  >({
    queryKey: ["savedPosts"],
    queryFn: fetchSavedPosts,
  });

  const savedPost = data?.data?.saved_posts || {};

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        header="Saved Bookmarks"
        subHeader="Quick access to your interested post"
      />
      <DataStateWrapper
        isLoading={isLoading}
        error={error}
        data={savedPost}
        emptyCondition={(data) => Object.keys(data).length === 0}
        loadingComponent={<PostList data={[]} section="" />}
        nodelay={true}
      >
        {(validData) => (
          <>
            {validData &&
              Object.keys(validData).map((key) => {
                const posts = validData[key];
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
          </>
        )}
      </DataStateWrapper>
    </div>
  );
};

export default SavedPosts;
