import React from "react";
import HomeComponent from "post/components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import SECTIONS from "db/postDb/sections.json"

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
    <div className="lg:grid lg:grid-cols-3 flex flex-col gap-y-6 lg:gap-y-4 lg:gap-x-2 ">
      {SECTIONS.map((key) => {
        return (
          <HomeComponent
            key={key}
            ListItemData={data.data[key] || []}
            section={key}
            height={heights[key] || heights.default}
          />
        );
      })}
    </div>
  );
};

export default Home;
