import React, { useState } from "react";
import List from "shared/ui/List";
import { IPostList } from "models/post/IPostList";
import axiosInstance from "shared/utils/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useQueryStates from "shared/hooks/query-states-hook";
import "./Category.css";
import { RootState } from "shared/store";
import { useSelector } from "react-redux";

// Fetch function with type annotations
const fetchCategoryPostList = async (
  category: string,
  token?: string
): Promise<IPostList> => {
  const { data } = await axiosInstance.get(`/public/category/${category}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

const Category: React.FC = () => {
  const { category = "" } = useParams<{ category: string }>();
  const { token } = useSelector((state: RootState) => state.auth.userData);
  const {
    data = { data: {} },
    isLoading,
    error,
  } = useQuery<IPostList, Error>({
    queryKey: ["categoryPostList", category],
    queryFn: () => fetchCategoryPostList(category, token),
    enabled: Boolean(category),
    staleTime: 5 * 60 * 1000,
  });

  const queryStateMessage = useQueryStates({
    isLoading,
    error: error ? error.message : null,
    empty: Object.keys(data.data).length === 0,
  });

  if (queryStateMessage) return queryStateMessage;

  return (
    <div className="flex gap-3">
      {Object.keys(data.data).map((key) => (
        <List key={key} currentRecords={data.data[key] || []} category={key} />
      ))}
    </div>
  );
};

export default Category;
