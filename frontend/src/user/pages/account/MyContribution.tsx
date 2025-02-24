import React from "react"; 
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import axiosInstance from "shared/utils/api/axios-instance";
import moment from "moment";
import PageHeader from "shared/ui/PageHeader";
import MyContributionComponent from "user/components/account/my_contribute";

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
  const {
    data = {
      data: {},
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

  if (!isLoading && Object.keys(data.data).length === 0) {
    return <NoData />;
  }
  return (
    <div className="flex flex-col">
      <PageHeader
        header="My Contribution"
        subHeader={
          <>
            <span>Last contributed on</span>
            <span className="ml-1">
              {moment(data.metadata.timeStamp.updatedAt).format("LL")}
            </span>
          </>
        }
      />

      <MyContributionComponent data={data.data} />
    </div>
  );
};

export default MyContribution;
