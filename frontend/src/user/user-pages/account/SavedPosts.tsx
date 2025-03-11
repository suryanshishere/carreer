import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import PostList from "post/shared/PostList";
import { Fragment } from "react/jsx-runtime";
import { startCase } from "lodash";
import PageHeader from "shared/ui/PageHeader";
import { ICommonListData } from "post/db/interfaces";
import DataStateWrapper from "shared/components/DataStateWrapper";
import { useParams } from "react-router-dom";
import { ISectionKey } from "post/db";

const fetchSavedPosts = async (): Promise<{
  data: { saved_posts: Partial<Record<ISectionKey, ICommonListData[]>> };
}> => {
  const response = await axiosInstance.get("/user/account/post/saved-posts");
  return response.data;
};

const SavedPosts = () => {
  const { section } = useParams<{ section?: ISectionKey }>();

  const {
    data = { data: { saved_posts: {} } },
    isLoading,
    error,
  } = useQuery<
    { data: { saved_posts: Partial<Record<ISectionKey, ICommonListData[]>> } },
    Error
  >({
    queryKey: ["savedPosts", section],
    queryFn: fetchSavedPosts,
  });

  const savedPost = data?.data?.saved_posts ?? {};

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
        loadingComponent={
          <PostList data={[]} section={section as ISectionKey} />
        }
        nodelay={true}
      >
        {(validData) => (
          <>
            {validData &&
              Object.entries(validData)
                .filter(
                  ([key, posts]) => (posts as ICommonListData[])?.length > 0
                )
                .map(([key, posts]) => (
                  <Fragment key={key}>
                    <h2 className="self-start whitespace-nowrap">
                      {startCase(key)}
                    </h2>
                    <PostList
                      data={posts as ICommonListData[]}
                      section={key as ISectionKey}
                    />
                  </Fragment>
                ))}
          </>
        )}
      </DataStateWrapper>
    </div>
  );
};

export default SavedPosts;
