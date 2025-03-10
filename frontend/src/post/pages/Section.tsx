import React from "react";
import PostList from "post/shared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DataStateWrapper from "shared/components/DataStateWrapper";

const Section: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();

  const {
    data = { data: { [section]: [] } },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categoryPostList", section],
    queryFn: async () => {
      const response = await axiosInstance.get(`/public/sections/${section}`);
      return response.data;
    },
    enabled: Boolean(section),
    retry: 3,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <DataStateWrapper
      isLoading={isLoading}
      error={error}
      data={data.data[section]}
      emptyCondition={(data) => data.length === 0}
      skipLoadingUI={true}
    >
      {(validData) => (
        <div className="flex flex-col gap-3">
          <PostList data={validData || []} section={section} />
        </div>
      )}
    </DataStateWrapper>
  );
};

export default Section;
