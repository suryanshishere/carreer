import React from "react";
import HomeComponent from "post/post-components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import POST_DB from "post/post-db";

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

  const emptySectionsCount = POST_DB.sections.reduce((count, key) => {
    const sectionData = data.data[key];
    if (!sectionData || sectionData.length === 0 || !sectionData[0]) {
      return count + 1;
    }
    return count;
  }, 0);

  if (!isLoading && emptySectionsCount >= 9) {
    return <NoData />;
  }

  return (
    <div className="mobile:grid medium_mobile:grid-cols-3 mobile:grid-cols-2 flex flex-col gap-y-6 mobile:gap-y-8 mobile:gap-x-2">
      {POST_DB.sections.map((section) => {
        return (
          <HomeComponent
            key={section}
            ListItemData={data.data[section] || []}
            section={section}
            height={heights[section] || heights.default}
          />
        );
      })}
    </div>
  );
};

export default Home;
