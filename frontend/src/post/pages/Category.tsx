import React from "react";
import List from "shared/uiComponents/List";
import { IPostList } from "models/post/IPostList";
import axiosInstance from "shared/utilComponents/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Category.css";

// Fetch function with type annotations
const fetchCategoryPostList = async (category: string): Promise<IPostList> => {
  const { data } = await axiosInstance.get(`/category/${category}`);
  return data;
};

const Category: React.FC = () => {
  const { category = "" } = useParams<{ category: string }>();
  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostList, Error>({
    queryKey: ["categoryPostList", category],
    queryFn: () => fetchCategoryPostList(category),
    enabled: Boolean(category),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (Object.keys(data).length === 0) return <p>Empty...</p>;

  return (
    <div className="flex gap-3">
      {Object.keys(data).map((key) => (
        <List key={key} currentRecords={data[key]} category={key} />
      ))}
    </div>
  );
};

export default Category;
