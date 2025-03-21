import React from "react";
import PostList from "posts/shared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "posts/db";
import { ParaSkeletonLoad } from "posts/shared/SkeletonLoad";

const Section: React.FC = () => {
  const { section } = useParams<{ section?: ISectionKey }>();

  const {
    data = { data: {} },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categoryPostList", section],
    queryFn: async () => {
      if (!section) throw new Error("Invalid section");
      const response = await axiosInstance.get(`/public/sections/${section}`);
      return response.data;
    },
    enabled: Boolean(section),
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  const postListData = section ? data.data[section] ?? [] : [];

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
          <PostList data={validData} section={section as ISectionKey} />
        </div>
      )}
    </DataStateWrapper>
  );
};

export default Section;
