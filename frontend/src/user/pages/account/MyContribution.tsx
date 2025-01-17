import React from "react";
import _ from "lodash";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import axiosInstance from "shared/utils/api/axios-instance";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";

// Define the types for the API response
interface ContributionDetails {
  [key: string]: string | number | ContributionDetails;
}

interface Contribution {
  [key: string]: ContributionDetails;
}

interface MyContributionResponse {
  data: {
    _id: string;
    contribution: Contribution;
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
      data: {
        _id: "",
        contribution: {},
      },
      message: "",
    },
    isLoading,
  } = useQuery<MyContributionResponse, Error>({
    queryKey: ["myContribution"],
    queryFn: fetchSavedPosts,
  });
  const { contribution } = data?.data || {};

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!isLoading && Object.keys(contribution).length === 0) {
    return <NoData />;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <h2 className="self-start w-full items-end p-0 flex gap-1">
        My Contribution
        <hr className="flex-1" />
      </h2> */}
      <div className="flex flex-col gap-2">
        {Object.entries(contribution).map(([key, value]) => (
          <div key={key} className=" ">
            <h2>{key.replace(/_/g, " ")}</h2>
            <div className="space-y-4 ">
              {Object.entries(value).map(([subKey, subValue], index) => (
                <>
                  <div key={subKey} className="p-1">
                    <a
                      href={`/sections/${subKey}/${key.toLowerCase()}`}
                      className="text-xs flex items-center gap-1 custom-link float-right"
                    >
                      Link to post{" "}
                      <LaunchSharpIcon fontSize="small" className="mt-1" />
                    </a>
                    <div className="flex items-center gap-2 justify-between">
                      <h2 className="capitalize">
                        {subKey.replace(/_/g, " ")}
                      </h2>
                    </div>
                    {typeof subValue === "object" &&
                    !Array.isArray(subValue) ? (
                      <ul className="pl-6">
                        {Object.entries(subValue as ContributionDetails).map(
                          ([detailKey, detailValue]) => (
                            <li key={detailKey} className="list-disc">
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
                  {index !== Object.entries(contribution).length - 1 && <hr />}
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyContribution;
