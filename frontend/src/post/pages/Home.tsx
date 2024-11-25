import React from "react";
import HomeListItem from "post/components/HomeComponent";
import axiosInstance from "shared/utils/api/axios-instance";
import { useQuery } from "@tanstack/react-query";
import { IPostList } from "models/post/IPostList";
import useQueryStates from "shared/hooks/query-states-hook";
import "./Home.css";
import { useSelector } from "react-redux";
import { RootState } from "shared/store";

const fetchHomePostList = async (token?: string): Promise<IPostList> => {
  const headers: { Authorization?: string } = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await axiosInstance.get("home", {
    headers: headers, // Pass headers here, which may or may not include Authorization
  });

  return data;
};

const heights: Record<string, string> = {
  result: "55rem",
  admit_card: "55rem",
  latest_job: "55rem",
  default: "30rem",
};

const Home: React.FC = () => {
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostList, Error>({
    queryKey: ["homePostList"],
    queryFn: () => fetchHomePostList(token),
    retry: 3,
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data).length === 0,
  });

  console.log(data);

  if (queryStateMessage) return queryStateMessage;

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
