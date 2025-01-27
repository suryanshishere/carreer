import React from "react";
import _, { startCase } from "lodash";
import { useQuery } from "@tanstack/react-query";
import NoData from "shared/components/dataStates/NoData";
import axiosInstance from "shared/utils/api/axios-instance";
import LaunchSharpIcon from "@mui/icons-material/LaunchSharp";
import { Link } from "react-router-dom";

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
  console.log(data);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!isLoading && Object.keys(contribution).length === 0) {
    return <NoData />;
  }

  return (
    <div className=" flex flex-col gap-4">
      <h3 className="ml-auto text-custom-gray">sadfa</h3>
      <div className="flex flex-col gap-3">
        {Object.entries(contribution).map(([key, value], index) => (
          <>
            <div key={index} className="flex flex-col gap-2">
              <h2>{startCase(key)}</h2>
              {Object.entries(value).map(([subKey, subValue]) => (
                <React.Fragment key={subKey}>
                  <div className="flex items-center justify-start">
                    <h2>{startCase(subKey)}</h2>
                    <Link
                      to={`/sections/${subKey}/${key.toLowerCase()}`}
                      className="text-custom-red hover:text-custom-blue mb-1"
                    >
                      <LaunchSharpIcon fontSize="small" />
                    </Link>
                  </div>
                  {typeof subValue === "object" && !Array.isArray(subValue) ? (
                    <ul className="">
                      {Object.entries(subValue as ContributionDetails).map(
                        ([detailKey, detailValue]) => (
                          <li key={detailKey} className="list-[square]">
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
                </React.Fragment>
              ))}
            </div>
            {index !== Object.entries(contribution).length - 1 && <hr />}
          </>
        ))}
      </div>
    </div>
  );
};

export default MyContribution;
