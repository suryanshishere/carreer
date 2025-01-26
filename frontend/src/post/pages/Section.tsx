import React from "react";
import PostList from "post/postShared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";

const Section: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();

  const {
    data = {
      data: {
        [section]: [],
      },
    },
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

  if (!isLoading && data.data[section].length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-3">
      <PostList data={data.data[section] || []} section={section} />
    </div>
  );
};

export default Section;
