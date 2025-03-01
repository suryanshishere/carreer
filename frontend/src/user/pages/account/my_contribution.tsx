import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import axiosInstance from "shared/utils/api/axios-instance";
import moment from "moment";
import PageHeader from "shared/ui/PageHeader";
import MyContributionComponent from "user/components/account/my_contribute";
import Button from "shared/utils/form/Button";

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

  const {
    data = {
      data: {
        approved: {},
        contribution: {},
      },
      message: "",
      metadata: {
        timeStamp: {
          updatedAt: "",
          createdAt: "",
        },
      },
    },
    isLoading,
  } = useQuery<MyContributionResponse, Error>({
    queryKey: ["myContribution"],
    queryFn: fetchSavedPosts,
  });

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!isLoading && Object.keys(data.data[selectedTab]).length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        header="My Contribution"
        subHeader={`Last contributed on ${moment(
          data.metadata.timeStamp.updatedAt
        ).format("LL")}`}
      />
      <div className="flex justify-start gap-2 mb-4">
        <Button
          onClick={() => setSelectedTab("contribution")}
          classProp={`rounded-full max-w-fit px-20 text-sm ${
            selectedTab === "contribution" ? "bg-custom_pale_yellow" : ""
          }`}
        >
          Contribution
        </Button>
        <Button
          onClick={() => setSelectedTab("approved")}
          classProp={`rounded-full max-w-fit px-4 text-sm ${
            selectedTab === "approved" ? "bg-custom_pale_yellow" : ""
          }`}
        >
          Approved
        </Button>
      </div>
      <MyContributionComponent data={data.data[selectedTab]} />
    </div>
  );
};

export default MyContribution;
