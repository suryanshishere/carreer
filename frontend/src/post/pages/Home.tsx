import React from "react";
import HomeListItem from "post/components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";

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

  if (!isLoading && Object.keys(data.data).length === 0) {
    return <NoData />;
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-x-2 md:gap-y-10 flex flex-col">
      {Object.keys(data.data).map((key) => {
        // if (!isLoading && data.data[key].length === 0) {
        //   return <NoData key={key} />;
        // }
        return (
          <HomeListItem
            key={key}
            ListItemData={  []}
            section={key}
            height={heights[key] || heights.default}
          />
        );
      })}
    </div>
  );
};

export default Home;
