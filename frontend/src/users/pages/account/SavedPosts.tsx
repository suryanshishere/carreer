import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import PostList from "posts/shared/PostList";
import { Fragment, useState } from "react";
import { startCase } from "lodash";
import PageHeader from "shared/ui/PageHeader";
import { ICommonListData } from "posts/db/interfaces";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { useParams } from "react-router-dom";
import { ISectionKey } from "posts/db";
import Collapse from "@mui/material/Collapse";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const fetchSavedPosts = async (): Promise<{
  data: { saved_posts: Partial<Record<ISectionKey, ICommonListData[]>> };
}> => {
  const response = await axiosInstance.get("/user/account/post/saved-posts");
  return response.data;
};

const SavedPosts = () => {
  const { section } = useParams<{ section?: ISectionKey }>();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

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

  const toggleExpand = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col gap-3">
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
          <div className="flex flex-col gap-[6px]">
            {validData &&
              Object.entries(validData)
                .filter(
                  ([key, posts]) => (posts as ICommonListData[])?.length > 0
                )
                .map(([key, posts]) => (
                  <Fragment key={key}>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <h2
                        onClick={() => toggleExpand(key)}
                        className="py-1 cursor-pointer self-start text-custom_red"
                      >
                        {startCase(key)}
                        {expandedSections[key] ? (
                          <ArrowDropUpIcon />
                        ) : (
                          <ArrowDropDownIcon />
                        )}
                      </h2>
                    </div>
                    <Collapse
                      in={expandedSections[key]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <PostList
                        data={posts as ICommonListData[]}
                        section={key as ISectionKey}
                      />
                    </Collapse>
                  </Fragment>
                ))}
          </div>
        )}
      </DataStateWrapper>
    </div>
  );
};

export default SavedPosts;
