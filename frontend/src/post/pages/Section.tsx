import React from "react";
import PostList from "post/shared/PostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";

const Section: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();

  const {
    data = { data: {} },
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;
  return (
    <div className="flex flex-col gap-3">
      {Object.keys(data.data).map((key) => (
        <PostList key={key} data={data.data[key] || []} section={key} />
      ))}
    </div>
  );
};

export default Section;
