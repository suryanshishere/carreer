import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "shared/utils/api/axios-instance";
import moment from "moment";
import PageHeader from "shared/ui/PageHeader";
import MyContributionComponent from "users/components/account/my-contribute";
import Button from "shared/utils/form/Button";
import DataStateWrapper from "shared/utils/DataStateWrapper";

// Define the types for the API response
export interface IContributionDetails {
  [key: string]: string | number | IContributionDetails;
}

interface IContribution {
  [key: string]: IContributionDetails;
}

interface MyContributionResponse {
  data: IContribution;
  metadata: {
    timeStamp: {
      updatedAt: string;
      createdAt: string;
    };
  };
  message: string;
}

const fetchSavedPosts = async (): Promise<MyContributionResponse> => {
  const response = await axiosInstance.get(
    "/user/account/post/my-contribution"
  );
  return response.data;
};

const MyContribution: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"contribution" | "approved">(
    "contribution"
  );

  const { data, isLoading, error } = useQuery<MyContributionResponse, Error>({
    queryKey: ["myContribution"],
    queryFn: fetchSavedPosts,
  });

  const selectedData = data?.data?.[selectedTab] || {};

  return (
    <div className="flex flex-col gap-2">
      {/* Render header and tab buttons always */}
      <PageHeader
        header="My Contribution"
        subHeader={`Last contributed on ${moment(
          data?.metadata?.timeStamp?.updatedAt || ""
        ).format("LL")}`}
      />
      <div className="flex mobile:justify-end gap-2 mb-3 -mt-3">
        <Button
          onClick={() => setSelectedTab("contribution")}
          className={`rounded-full max-w-fit px-4 py-1 text-sm ${
            selectedTab === "contribution" ? "bg-custom_pale_yellow" : ""
          }`}
        >
          Contribution
        </Button>
        <Button
          onClick={() => setSelectedTab("approved")}
          className={`rounded-full max-w-fit px-2 py-1 text-sm ${
            selectedTab === "approved" ? "bg-custom_pale_yellow" : ""
          }`}
        >
          Approved
        </Button>
      </div>

      <DataStateWrapper
        isLoading={isLoading}
        error={error}
        data={selectedData}
        emptyCondition={(data) => Object.keys(data).length === 0}
      >
        {(validData) =>
          validData && <MyContributionComponent data={validData} />
        }
      </DataStateWrapper>
    </div>
  );
};

export default MyContribution;
