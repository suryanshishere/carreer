import React from "react";
import HomeComponent from "posts/components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import POST_DB from "posts/db";
import DataStateWrapper from "shared/utils/DataStateWrapper";

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

  return (
    <DataStateWrapper
      isLoading={isLoading}
      error={error}
      data={data.data}
      emptyCondition={(data) =>
        POST_DB.sections.every((section) => {
          const sectionData = data[section];
          return !sectionData || sectionData.length === 0 || !sectionData[0];
        })
      }
      skipLoadingUI={true}
    >
      {(validData) => (
        <div className="mobile:grid medium_mobile:grid-cols-3 mobile:grid-cols-2 flex flex-col gap-y-6 mobile:gap-y-8 mobile:gap-x-2">
          {POST_DB.sections.map((section) => {
            return (
              <HomeComponent
                key={section}
                data={validData[section] || []}
                section={section}
                height={heights[section] || heights.default}
              />
            );
          })}
        </div>
      )}
    </DataStateWrapper>
  );
};

export default Home;
