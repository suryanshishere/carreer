import React from "react";
import DetailItem from "post/components/DetailItem";
import DetailItemHeader from "post/components/DetailItemHeader";
import { IPostDetail } from "models/post/IPostDetail";
import axiosInstance from "shared/utilComponents/api/axios-instance";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./Detail.css";

const fetchPostDetail = async (
  category: string,
  postId: string
): Promise<IPostDetail> => {
  const { data } = await axiosInstance.get(`/category/${category}/${postId}`);
  return data;
};

const Detail: React.FC = () => {
  const { category = "", postId = "" } = useParams<{
    postId: string;
    category: string;
  }>();
  const {
    data = {},
    isLoading,
    error,
  } = useQuery<IPostDetail, Error>({
    queryKey: ["detailPost"],
    queryFn: () => fetchPostDetail(category, postId),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (Object.keys(data).length === 0) return <p>Empty...</p>;

  return (
    <div className="detail_page_sec flex flex-col items-center">
      <DetailItemHeader />
      <h3>postId</h3>
      {data && <DetailItem detailPageData={data} />}
    </div>
  );
};

export default Detail;
