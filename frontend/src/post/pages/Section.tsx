import React, { useState } from "react";
import List from "shared/ui/List";
import { IPostList } from "models/postModels/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import { RootState } from "shared/store";
import { useSelector } from "react-redux";

// Fetch function with type annotations
const fetchCategoryPostList = async (
  section: string,
  token?: string
): Promise<{
  data: {
    [key: string]: IPostList;
  };
}> => {
  const { data } = await axiosInstance.get(`/public/sections/${section}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const Section: React.FC = () => {
  const { section = "" } = useParams<{ section: string }>();
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const {
    data = { data: {} },
    isLoading,
    error,
  } = useQuery<
    {
      data: {
        [key: string]: IPostList;
      };
    },
    Error
  >({
    queryKey: ["categoryPostList", section],
    queryFn: () => fetchCategoryPostList(section, token),
    enabled: Boolean(section),
    staleTime: 5 * 60 * 1000,
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;
  console.log(data.data);
  return (
    <div className="flex gap-3">
      {Object.keys(data.data).map((key) => (
        <List key={key} data={data.data[key] || []} section={key} />
      ))}
    </div>
  );
};

export default Section;
