import React from "react";
import PostList from "posts/shared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "posts/db";
import { ParaSkeletonLoad } from "posts/shared/SkeletonLoad";
import Button from "shared/utils/form/Button";

interface SectionResponse {
  data: Record<ISectionKey, any[]>;
  nextPage?: number | null;
}

const Section: React.FC = () => {
  const { section } = useParams<{ section?: ISectionKey }>();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<SectionResponse, Error>({
    queryKey: ["categoryPostList", section],
    queryFn: async ({ pageParam = 1 }) => {
      if (!section) throw new Error("Invalid section");
      const response = await axiosInstance.get(
        `/public/sections/${section}?page=${pageParam}`
      );
      return response.data;
    },
    initialPageParam: 1,
    enabled: Boolean(section),
    retry: 3,
    staleTime: 5 * 60 * 1000,
    getNextPageParam: (lastPage) =>
      lastPage.nextPage !== undefined && lastPage.nextPage !== null
        ? lastPage.nextPage
        : undefined,
  });

  const postListData = section
    ? data?.pages.flatMap((page) => page.data[section] || []) ?? []
    : [];
  const pages = data?.pages ?? [];

  return (
    <DataStateWrapper
      isLoading={isLoading}
      error={error || (!section ? new Error("Invalid section") : null)}
      data={postListData}
      emptyCondition={(data) => data.length === 0}
      nodelay={true}
      loadingComponent={
        <ul className="self-start w-full p-0 m-0 flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <ParaSkeletonLoad key={index} />
          ))}
        </ul>
      }
    >
      {(validData) => (
        <div className="flex flex-col gap-3">
          {pages.map((page, index) => (
            <div key={index} className="flex flex-col gap-3">
              {index !== 0 && <hr />}
              <PostList
                data={page.data[section as ISectionKey] || []}
                section={section as ISectionKey}
              />
            </div>
          ))}
          <div className="flex justify-center mt-4">
            <Button
              loadMoreButton
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading..."
                : hasNextPage
                ? "Load More"
                : "No More Posts"}
            </Button>
          </div>

          {isFetchingNextPage && (
            <ul className="self-start w-full p-0 m-0 flex flex-col gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <ParaSkeletonLoad key={index} />
              ))}
            </ul>
          )}
        </div>
      )}
    </DataStateWrapper>
  );
};

export default Section;
