import React from "react";
import HomeListItem from "post/components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";

const heights: Record<string, string> = {
  result: "55rem",
  admit_card: "55rem",
  latest_job: "55rem",
  default: "30rem",
};

const Home: React.FC = () => {
  const {
    data = { data: {} },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["homePostList"],
    queryFn: async () => {
      const response = await axiosInstance.get("/public/home");
      return response.data;
    },
    retry: 3,
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-10">
      {Object.keys(data.data).map((key) => (
        <HomeListItem
          key={key}
          ListItemData={data.data[key] || []}
          section={key}
          height={heights[key] || heights.default}
        />
      ))}
    </div>
  );
};

export default Home;
