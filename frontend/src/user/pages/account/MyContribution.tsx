import React from "react";
import _, { startCase } from "lodash";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import axiosInstance from "shared/utils/api/axios-instance";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";
import { Link } from "react-router-dom";
import moment from "moment";
import PageHeader from "shared/ui/PageHeader";

// Define the types for the API response
interface ContributionDetails {
  [key: string]: string | number | ContributionDetails;
}

interface IContribution {
  [key: string]: ContributionDetails;
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
  console.log(data);
  return (
    <div className=" flex flex-col gap-4">
      <PageHeader
        header="My Contribution"
        subHeader={
          <>
            Last contributed on
            <span>
              {moment(data.metadata.timeStamp.updatedAt).format("LL")}
            </span>
          </>
        }
      />
      <div className="flex flex-col gap-4">
        {Object.entries(data.data).map(([key, value], index) => (
          <>
            <div key={index} className=" flex flex-col gap-2">
              <h2 className="self-start pl-0">{startCase(key)}</h2>
              <div className="flex flex-col gap-2 border-l-2">
                {/* <div className="absolute h-full bottom-0 w-1 bg-custom-red"></div> */}
                {Object.entries(value).map(([subKey, subValue], index) => (
                  <div className="" key={index}>
                    <div className="flex items-center justify-start">
                      <h2>{startCase(subKey)}</h2>
                      <Link
                        to={`/sections/${subKey}/${key.toLowerCase()}`}
                        className="text-custom-red hover:text-custom-blue mb-1"
                      >
                        <LaunchSharpIcon fontSize="small" />
                      </Link>
                    </div>
                    {typeof subValue === "object" &&
                    !Array.isArray(subValue) ? (
                      <ul className="pl-2">
                        {Object.entries(subValue as ContributionDetails).map(
                          ([detailKey, detailValue]) => (
                            <li key={detailKey}>
                              <span className="font-medium">
                                {detailKey.replace(/_/g, " ")}:
                              </span>{" "}
                              {detailValue.toString()}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>{subValue.toString()}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {index !== Object.entries(data.data).length - 1 && <hr />}
          </>
        ))}
      </div>
    </div>
  );
};

export default MyContribution;
