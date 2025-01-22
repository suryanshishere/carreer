import React from "react";
<<<<<<< HEAD
import PostList from "shared/sharedPostComponents/PostList";
import { IPostList } from "models/postModels/IPostList";
=======
import PostList from "post/postShared/PostList";
>>>>>>> user
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

<<<<<<< HEAD
  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;
console.log(data.data)
=======
  if (!isLoading && data.data[section].length === 0) {
    return <NoData />;
  }

>>>>>>> user
  return (
    <div className="flex flex-col gap-3">
      <PostList data={data.data[section] || []} section={section} />
    </div>
  );
};

export default Section;
