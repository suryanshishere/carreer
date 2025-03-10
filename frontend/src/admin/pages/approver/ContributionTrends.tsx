import React from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import renderPostData from "post/shared/render-post-data";
import DataStateWrapper from "shared/components/DataStateWrapper";

const ContributionTrends: React.FC<{ section: string }> = ({ section }) => {
  const {
    data = { data: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contributionTrends", section],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/admin/approver/contri-post-codes/${section}`
      );
      return response.data;
    },
    retry: 3,
  });

  return (
    <DataStateWrapper
      isLoading={isLoading}
      error={error}
      data={data.data}
      emptyCondition={(data) => data.length === 0}
      loadingComponent={<div className="text-center">Loading...</div>}
      skipLoadingUI={false}
    >
      {(validData) => (
        <div className="w-full h-full flex items-start">
          {renderPostData("contributionTrends", validData)}
        </div>
      )}
    </DataStateWrapper>
  );
};

export default ContributionTrends;
