import React from "react";
import PostList from "post/post-shared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DataStateWrapper from "shared/utils/DataStateWrapper";
import { ISectionKey } from "post/post-db";

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
      skipLoadingUI={true}
    >
      {(validData) => (
        <div className="flex flex-col gap-3">
          {section && <PostList data={validData} section={section} />}
        </div>
      )}
    </DataStateWrapper>
  );
};

export default Section;
