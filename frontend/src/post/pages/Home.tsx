import React, { useContext } from "react";
import HomeListItem from "post/components/HomeComponent";
import axiosInstance from "shared/utilComponents/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { IPostList } from "models/post/IPostList";
import "./Home.css";
import { ResponseContext } from "shared/utilComponents/context/response-context";
import handleQueryStates from "shared/uiComponents/quick/handle-query-states";

const fetchHomePostList = async (): Promise<IPostList> => {
  const { data } = await axiosInstance.get("/home");
  return data;
};

// Define specific heights for different categories for better readability
const heights: Record<string, string> = {
  result: "55rem",
  admit_card: "55rem",
  latest_job: "55rem",
  default: "30rem",
};

const Home: React.FC = () => {
  const response = useContext(ResponseContext);
  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostList, Error>({
    queryKey: ["homePostList"],
    queryFn: fetchHomePostList,
  });

  const queryState = handleQueryStates(isLoading, error, data, response);
  if (queryState) return queryState;

  return (
    <div className="grid grid-cols-3 gap-3">
      {Object.keys(data).map((key) => (
        <HomeListItem
          key={key}
          ListItemData={data[key] || []}
          category={key}
          height={heights[key] || heights.default}
        />
      ))}
    </div>
  );
};

export default Home;
